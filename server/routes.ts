import type { Express, NextFunction, Request, RequestHandler, Response } from "express";
import type { Server } from "http";
import { randomBytes, randomUUID, timingSafeEqual } from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";
import { z } from "zod";
import { getStorage } from "./storage";
import {
  auditEvent,
  hashPassword,
  isPasswordHash,
  isSafeHttpUrl,
  rateLimit,
  requireAuth,
  requireRole,
  verifyPassword,
} from "./security";

const uploadsDir = path.join(process.cwd(), "uploads");
fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o700 });

const FILE_TYPES: Record<string, readonly string[]> = {
  ".pdf": ["application/pdf"],
  ".doc": ["application/msword"],
  ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  ".xls": ["application/vnd.ms-excel"],
  ".xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ".ppt": ["application/vnd.ms-powerpoint"],
  ".pptx": ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  ".hwp": ["application/x-hwp", "application/haansofthwp"],
  ".hwpx": ["application/zip", "application/x-hwpx"],
  ".zip": ["application/zip", "application/x-zip-compressed"],
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 5, fields: 5 },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (!FILE_TYPES[extension]?.includes(file.mimetype)) {
      callback(new Error("UPLOAD_REJECTED"));
      return;
    }
    callback(null, true);
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "로그인 시도가 너무 많습니다. 15분 후 다시 시도해주세요",
});
const bootstrapLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5 });
const commentLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 10 });
const viewLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 120 });
const uploadLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

const usernameSchema = z.string().trim().min(4).max(32).regex(/^[A-Za-z0-9._-]+$/);
const passwordSchema = z.string().min(10).max(128);
const nameSchema = z.string().trim().min(1).max(80);
const dateSchema = z.string().trim().regex(/^\d{4}[.-]\d{2}[.-]\d{2}$/);
const isoDateSchema = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/);
const fileReferenceSchema = z.string().trim().max(300).refine(value => {
  if (!value.startsWith("/uploads/")) return false;
  const filename = value.slice("/uploads/".length);
  return filename.length > 0
    && filename.length <= 255
    && path.basename(filename) === filename
    && Boolean(FILE_TYPES[path.extname(filename).toLowerCase()])
    && !filename.includes("\0");
});
const websiteSchema = z.string().trim().max(2_048).refine(isSafeHttpUrl);

const adminCreateSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  name: nameSchema,
});
const bootstrapSetupSchema = adminCreateSchema.extend({
  setupCode: z.string().trim().min(32).max(128),
});
const loginSchema = z.object({ username: usernameSchema, password: z.string().min(1).max(128) });
const passwordResetSchema = z.object({ password: passwordSchema });

const noticeCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().max(20_000),
  date: dateSchema,
  isImportant: z.boolean().default(false),
  files: z.array(fileReferenceSchema).max(5).default([]),
});
const noticeUpdateSchema = noticeCreateSchema
  .omit({ date: true })
  .partial()
  .refine(value => Object.keys(value).length > 0);

const nullableShortText = z.string().trim().max(300).nullable().optional();
const paperCreateSchema = z.object({
  category: z.enum(["conference", "journal"]),
  title: z.string().trim().min(1).max(300),
  authors: z.string().trim().min(1).max(1_000),
  firstAuthor: nullableShortText,
  correspondingAuthor: nullableShortText,
  venue: nullableShortText,
  journal: nullableShortText,
  volume: nullableShortText,
  year: z.string().trim().regex(/^\d{4}$/),
  abstract: z.string().trim().max(10_000).nullable().optional(),
  keywords: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
  files: z.array(fileReferenceSchema).max(5).default([]),
  websiteUrl: websiteSchema.nullable(),
  date: dateSchema,
});
const paperUpdateSchema = paperCreateSchema
  .omit({ date: true })
  .partial()
  .refine(value => Object.keys(value).length > 0);

const httpsAttachmentSchema = z.string().trim().max(2_048).refine(value => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}, "첨부 주소는 HTTPS 주소여야 합니다");
const admissionGuidelineCreateSchema = z.object({
  title: z.string().trim().min(1).max(300),
  content: z.string().trim().max(20_000),
  organization: z.string().trim().min(1).max(120),
  date: isoDateSchema,
  attachmentUrl: httpsAttachmentSchema.nullable().optional(),
  attachmentName: z.string().trim().min(1).max(255).nullable().optional(),
});
const admissionGuidelineUpdateSchema = admissionGuidelineCreateSchema
  .partial()
  .refine(value => Object.keys(value).length > 0);
const commentSchema = z.object({ content: z.string().trim().min(1).max(2_000) });

type AsyncRoute = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
const asyncHandler = (handler: AsyncRoute): RequestHandler => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

function parseBody<T extends z.ZodTypeAny>(schema: T, req: Request, res: Response): z.infer<T> | null {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "입력값을 확인해주세요",
      code: "VALIDATION_ERROR",
      fields: parsed.error.issues.slice(0, 5).map(issue => issue.path.join(".")),
    });
    return null;
  }
  return parsed.data;
}

function parseId(req: Request, res: Response): number | null {
  const result = z.coerce.number().int().positive().safeParse(req.params.id);
  if (!result.success) {
    res.status(400).json({ error: "잘못된 식별자입니다", code: "INVALID_ID" });
    return null;
  }
  return result.data;
}

function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}

function publicComment<T extends { userId?: number | null }>(req: Request, comment: T) {
  const { userId: _userId, ...dto } = comment;
  return {
    ...dto,
    canEdit: Boolean(req.session.user)
      && (req.session.user!.role === "ADMIN" || comment.userId === req.session.user!.id),
  };
}

function publicAdmin(user: {
  id: number;
  username: string;
  name: string;
  role: string;
  status: string;
  passwordResetRequired: boolean;
  registeredAt: string;
  registeredTime: string;
}) {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    status: user.status,
    passwordResetRequired: user.passwordResetRequired,
    registeredAt: user.registeredAt,
    registeredTime: user.registeredTime,
  };
}

function publicSessionUser(user: {
  id: number;
  username: string;
  name: string;
  role: "ADMIN" | "USER";
  authVersion: number;
}) {
  return { id: user.id, username: user.username, name: user.name, role: user.role };
}

function isMagicNumberValid(file: Express.Multer.File): boolean {
  const extension = path.extname(file.originalname).toLowerCase();
  const bytes = file.buffer;
  const isPdf = bytes.subarray(0, 5).toString("ascii") === "%PDF-";
  const isZip = bytes.length >= 4
    && bytes[0] === 0x50
    && bytes[1] === 0x4b
    && [0x03, 0x05, 0x07].includes(bytes[2])
    && [0x04, 0x06, 0x08].includes(bytes[3]);
  const isOle = bytes.length >= 8
    && bytes.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));

  if (extension === ".pdf") return isPdf;
  if ([".docx", ".xlsx", ".pptx", ".hwpx", ".zip"].includes(extension)) return isZip;
  if ([".doc", ".xls", ".ppt", ".hwp"].includes(extension)) return isOle;
  return false;
}

function sessionRegenerate(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.regenerate(error => error ? reject(error) : resolve());
  });
}

function sessionSave(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.save(error => error ? reject(error) : resolve());
  });
}

function sessionDestroy(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.destroy(error => error ? reject(error) : resolve());
  });
}

function currentKoreanDateTime() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find(part => part.type === type)?.value ?? "";
  return {
    registeredAt: `${value("year")}.${value("month")}.${value("day")}`,
    registeredTime: `${value("hour")}:${value("minute")}`,
  };
}

const dummyPasswordHash = hashPassword(randomBytes(32).toString("hex"));

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  const storage = getStorage();
  const configuredAdminUsername = process.env.ADMIN_USERNAME?.trim();
  const configuredAdminHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  const hasConfiguredAdmin = Boolean(configuredAdminUsername && configuredAdminHash);
  const adminOnly: RequestHandler = (req, res, next) => {
    requireRole("ADMIN")(req, res, () => {
      const sessionUser = req.session.user!;
      if (sessionUser.id === 0) {
        if (hasConfiguredAdmin && sessionUser.username === configuredAdminUsername) return next();
        return res.status(403).json({ error: "관리자 세션을 다시 확인해주세요", code: "ADMIN_SESSION_INVALID" });
      }
      storage.getUser(sessionUser.id)
        .then(user => {
          if (!user || user.status !== "active" || user.role.toLowerCase() !== "admin") {
            return res.status(403).json({ error: "활성 관리자 계정이 아닙니다", code: "ADMIN_ACCOUNT_INACTIVE" });
          }
          if (user.authVersion !== sessionUser.authVersion) {
            return sessionDestroy(req)
              .then(() => res.status(401).json({ error: "보안을 위해 다시 로그인해주세요", code: "ADMIN_SESSION_STALE" }))
              .catch(next);
          }
          next();
        })
        .catch(next);
    });
  };

  const bootstrapTtlMs = 15 * 60 * 1000;
  let bootstrapCode: string | null = null;
  let bootstrapExpiresAt = 0;
  let bootstrapInProgress = false;

  async function bootstrapRequired(): Promise<boolean> {
    return !hasConfiguredAdmin && await storage.getActiveAdminCount() === 0;
  }

  async function ensureBootstrapCode(): Promise<void> {
    if (!await bootstrapRequired()) {
      bootstrapCode = null;
      bootstrapExpiresAt = 0;
      return;
    }
    if (bootstrapCode && bootstrapExpiresAt > Date.now()) return;
    bootstrapCode = randomBytes(32).toString("base64url");
    bootstrapExpiresAt = Date.now() + bootstrapTtlMs;
    console.warn(JSON.stringify({
      type: "admin_bootstrap",
      message: "No active administrator exists. Use this one-time setup code within 15 minutes.",
      setupCode: bootstrapCode,
      expiresAt: new Date(bootstrapExpiresAt).toISOString(),
    }));
  }

  await ensureBootstrapCode();

  app.use(["/api/admins", "/api/admin-bootstrap"], (_req, res, next) => {
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.setHeader("Pragma", "no-cache");
    next();
  });

  app.get("/uploads/:filename", adminOnly, asyncHandler(async (req, res) => {
    const filename = req.params.filename;
    const extension = path.extname(filename).toLowerCase();
    if (!filename || filename.length > 255 || path.basename(filename) !== filename || !FILE_TYPES[extension]) {
      return res.status(404).json({ error: "파일을 찾을 수 없습니다", code: "FILE_NOT_FOUND" });
    }
    const filePath = path.join(uploadsDir, filename);
    try {
      await fs.promises.access(filePath, fs.constants.R_OK);
    } catch {
      return res.status(404).json({ error: "파일을 찾을 수 없습니다", code: "FILE_NOT_FOUND" });
    }
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    return res.download(filePath, filename);
  }));

  app.post("/api/upload", adminOnly, uploadLimiter, (req, res) => {
    upload.array("files", 5)(req, res, async error => {
      if (error instanceof multer.MulterError) {
        const message = error.code === "LIMIT_FILE_SIZE"
          ? "파일당 최대 크기는 10MB입니다"
          : "파일 업로드 제한을 확인해주세요";
        return res.status(400).json({ error: message, code: "UPLOAD_REJECTED" });
      }
      if (error) return res.status(400).json({ error: "허용되지 않은 파일입니다", code: "UPLOAD_REJECTED" });

      const files = req.files as Express.Multer.File[] | undefined;
      if (!files?.length || files.some(file => !isMagicNumberValid(file))) {
        return res.status(400).json({ error: "파일 형식 또는 파일 내용을 확인해주세요", code: "UPLOAD_REJECTED" });
      }
      const writtenPaths: string[] = [];
      try {
        const uploadedFiles = [];
        for (const file of files) {
          const extension = path.extname(file.originalname).toLowerCase();
          const storedName = `${randomUUID()}${extension}`;
          const storedPath = path.join(uploadsDir, storedName);
          await fs.promises.writeFile(storedPath, file.buffer, { flag: "wx", mode: 0o600 });
          writtenPaths.push(storedPath);
          uploadedFiles.push({
            name: path.basename(file.originalname).slice(0, 255),
            url: `/uploads/${storedName}`,
            size: file.size,
            type: extension.slice(1),
          });
        }
        auditEvent(req, "file.upload", `${uploadedFiles.length} file(s)`);
        return res.status(201).json({ files: uploadedFiles });
      } catch {
        await Promise.allSettled(writtenPaths.map(storedPath => fs.promises.unlink(storedPath)));
        return res.status(500).json({ error: "파일 저장에 실패했습니다", code: "UPLOAD_FAILED" });
      }
    });
  });

  app.get("/api/admin-bootstrap/status", asyncHandler(async (_req, res) => {
    const required = await bootstrapRequired();
    if (required) await ensureBootstrapCode();
    return res.json({
      required,
      expiresAt: required && bootstrapExpiresAt > Date.now()
        ? new Date(bootstrapExpiresAt).toISOString()
        : null,
    });
  }));

  app.post("/api/admin-bootstrap/setup", bootstrapLimiter, asyncHandler(async (req, res) => {
    const input = parseBody(bootstrapSetupSchema, req, res);
    if (!input) return;
    if (!await bootstrapRequired()) {
      return res.status(409).json({ error: "관리자 초기 설정이 이미 완료되었습니다", code: "BOOTSTRAP_NOT_REQUIRED" });
    }
    if (bootstrapInProgress) {
      return res.status(409).json({ error: "관리자 초기 설정이 진행 중입니다", code: "BOOTSTRAP_IN_PROGRESS" });
    }
    if (!bootstrapCode || bootstrapExpiresAt <= Date.now()) {
      bootstrapCode = null;
      bootstrapExpiresAt = 0;
      return res.status(410).json({ error: "초기 설정 코드가 만료되었습니다. 서버 로그에서 새 코드를 확인해주세요", code: "BOOTSTRAP_EXPIRED" });
    }
    const provided = Buffer.from(input.setupCode);
    const expected = Buffer.from(bootstrapCode);
    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
      auditEvent(req, "admin.bootstrap_failed");
      return res.status(401).json({ error: "초기 설정 코드가 올바르지 않습니다", code: "BOOTSTRAP_CODE_INVALID" });
    }
    bootstrapInProgress = true;
    try {
      const result = await storage.createFirstAdminSafely({
        username: input.username,
        password: await hashPassword(input.password),
        name: input.name,
        ...currentKoreanDateTime(),
      });
      if (result.status === "already_exists") {
        bootstrapCode = null;
        bootstrapExpiresAt = 0;
        return res.status(409).json({ error: "관리자 초기 설정이 이미 완료되었습니다", code: "BOOTSTRAP_NOT_REQUIRED" });
      }
      const admin = result.admin;
      bootstrapCode = null;
      bootstrapExpiresAt = 0;
      await sessionRegenerate(req);
      req.session.user = { id: admin.id, username: admin.username, name: admin.name, role: "ADMIN", authVersion: admin.authVersion };
      req.session.createdAt = Date.now();
      await sessionSave(req);
      auditEvent(req, "admin.bootstrap_complete", `admin:${admin.id}`);
      return res.status(201).json(publicAdmin(admin));
    } finally {
      bootstrapInProgress = false;
    }
  }));

  app.get("/api/admins", adminOnly, asyncHandler(async (_req, res) => {
    const admins = (await storage.getAdmins()).map(publicAdmin);
    return res.json(admins);
  }));

  app.post("/api/admins", adminOnly, asyncHandler(async (req, res) => {
    const input = parseBody(adminCreateSchema, req, res);
    if (!input) return;
    if (await storage.getUserByUsername(input.username)) {
      return res.status(409).json({ error: "이미 사용 중인 아이디입니다", code: "USERNAME_TAKEN" });
    }
    let admin;
    try {
      admin = await storage.createAdmin({
        username: input.username,
        password: await hashPassword(input.password),
        name: input.name,
        ...currentKoreanDateTime(),
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        return res.status(409).json({ error: "이미 사용 중인 아이디입니다", code: "USERNAME_TAKEN" });
      }
      throw error;
    }
    auditEvent(req, "admin.create", `admin:${admin.id}`);
    return res.status(201).json(publicAdmin(admin));
  }));

  app.patch("/api/admins/:id/password", adminOnly, asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    const input = parseBody(passwordResetSchema, req, res);
    if (!id || !input) return;
    const admin = await storage.getUser(id);
    if (!admin || admin.role.toLowerCase() !== "admin") {
      return res.status(404).json({ error: "관리자를 찾을 수 없습니다", code: "ADMIN_NOT_FOUND" });
    }
    await storage.updateUserPassword(id, await hashPassword(input.password));
    auditEvent(req, "admin.password_reset", `admin:${id}`);
    if (req.session.user!.id === id) {
      await sessionDestroy(req);
      res.clearCookie("dku.sid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      return res.json({ success: true, reauthenticationRequired: true });
    }
    return res.json({ success: true });
  }));

  app.delete("/api/admins/:id", adminOnly, asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    if (!id) return;
    if (req.session.user!.id === id) {
      return res.status(409).json({ error: "현재 로그인한 관리자 계정은 삭제할 수 없습니다", code: "SELF_DELETE_BLOCKED" });
    }
    const result = await storage.deleteAdminSafely(id, hasConfiguredAdmin);
    if (result === "not_found") {
      return res.status(404).json({ error: "관리자를 찾을 수 없습니다", code: "ADMIN_NOT_FOUND" });
    }
    if (result === "last_admin") {
      return res.status(409).json({ error: "마지막 활성 관리자 계정은 삭제할 수 없습니다", code: "LAST_ADMIN_BLOCKED" });
    }
    auditEvent(req, "admin.delete", `admin:${id}`);
    return res.json({ success: true });
  }));

  app.get("/api/users", adminOnly, (_req, res) => res.status(410).json({
    error: "회원 관리 기능은 관리자 관리 기능으로 대체되었습니다",
    code: "USER_API_RETIRED",
  }));

  app.post("/api/users", (_req, res) => res.status(410).json({
    error: "공개 회원가입은 제공하지 않습니다",
    code: "SIGNUP_DISABLED",
  }));

  app.post("/api/users/login", loginLimiter, asyncHandler(async (req, res) => {
    const input = parseBody(loginSchema, req, res);
    if (!input) return;

    if (configuredAdminUsername && input.username === configuredAdminUsername) {
      const valid = configuredAdminHash
        ? await verifyPassword(input.password, configuredAdminHash)
        : await verifyPassword(input.password, await dummyPasswordHash);
      if (!valid) {
        auditEvent(req, "auth.login_failed", "admin");
        return res.status(401).json({ error: "아이디 또는 비밀번호가 올바르지 않습니다", code: "INVALID_CREDENTIALS" });
      }
      await sessionRegenerate(req);
      req.session.user = { id: 0, username: configuredAdminUsername, name: "관리자", role: "ADMIN", authVersion: 0 };
      req.session.createdAt = Date.now();
      await sessionSave(req);
      auditEvent(req, "auth.login_success", "admin");
      return res.json(publicSessionUser(req.session.user));
    }

    const user = await storage.getUserByUsername(input.username);
    if (!user) {
      await verifyPassword(input.password, await dummyPasswordHash);
      auditEvent(req, "auth.login_failed", "user");
      return res.status(401).json({ error: "아이디 또는 비밀번호가 올바르지 않습니다", code: "INVALID_CREDENTIALS" });
    }
    if (user.status !== "active" || user.role.toLowerCase() !== "admin") {
      return res.status(403).json({ error: "사용할 수 없는 계정입니다", code: "ACCOUNT_DISABLED" });
    }
    if (user.passwordResetRequired || !isPasswordHash(user.password)) {
      return res.status(403).json({ error: "관리자에게 비밀번호 재설정을 요청해주세요", code: "PASSWORD_RESET_REQUIRED" });
    }
    if (!await verifyPassword(input.password, user.password)) {
      auditEvent(req, "auth.login_failed", "user");
      return res.status(401).json({ error: "아이디 또는 비밀번호가 올바르지 않습니다", code: "INVALID_CREDENTIALS" });
    }
    await sessionRegenerate(req);
    req.session.user = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: "ADMIN",
      authVersion: user.authVersion,
    };
    req.session.createdAt = Date.now();
    await sessionSave(req);
    auditEvent(req, "auth.login_success", `user:${user.id}`);
    return res.json(publicSessionUser(req.session.user));
  }));

  app.post("/api/users/logout", requireAuth, (req, res) => {
    auditEvent(req, "auth.logout");
    req.session.destroy(error => {
      if (error) return res.status(500).json({ error: "로그아웃에 실패했습니다", code: "LOGOUT_FAILED" });
      res.clearCookie("dku.sid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      return res.json({ success: true });
    });
  });

  app.get("/api/users/me", requireAuth, asyncHandler(async (req, res) => {
    const sessionUser = req.session.user!;
    if (sessionUser.id === 0) {
      if (hasConfiguredAdmin && sessionUser.username === configuredAdminUsername) {
        return res.json(publicSessionUser(sessionUser));
      }
    } else {
      const user = await storage.getUser(sessionUser.id);
      if (user
        && user.status === "active"
        && user.role.toLowerCase() === "admin"
        && isPasswordHash(user.password)
        && !user.passwordResetRequired
        && user.authVersion === sessionUser.authVersion) {
        return res.json(publicSessionUser(sessionUser));
      }
    }
    await sessionDestroy(req);
    res.clearCookie("dku.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return res.status(401).json({ error: "로그인이 만료되었습니다", code: "SESSION_EXPIRED" });
  }));

  app.patch("/api/users/:id/password", adminOnly, (_req, res) => res.status(410).json({ error: "관리자 비밀번호 재설정 API를 이용해주세요", code: "USER_API_RETIRED" }));
  app.delete("/api/users/:id", adminOnly, (_req, res) => res.status(410).json({ error: "관리자 관리 API를 이용해주세요", code: "USER_API_RETIRED" }));

  app.get("/api/admissions", asyncHandler(async (_req, res) => {
    return res.json(await storage.getAdmissionGuidelines());
  }));

  app.get("/api/admissions/:id", asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    if (!id) return;
    const guideline = await storage.getAdmissionGuideline(id);
    if (!guideline) {
      return res.status(404).json({ error: "모집요강을 찾을 수 없습니다", code: "ADMISSION_NOT_FOUND" });
    }
    return res.json(guideline);
  }));

  app.post("/api/admissions", adminOnly, asyncHandler(async (req, res) => {
    const input = parseBody(admissionGuidelineCreateSchema, req, res);
    if (!input) return;
    const guideline = await storage.createAdmissionGuideline({
      ...input,
      views: 0,
      attachmentUrl: input.attachmentUrl ?? null,
      attachmentName: input.attachmentName ?? null,
    });
    auditEvent(req, "admission.create", `admission:${guideline.id}`);
    return res.status(201).json(guideline);
  }));

  app.patch("/api/admissions/:id", adminOnly, asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    const input = parseBody(admissionGuidelineUpdateSchema, req, res);
    if (!id || !input) return;
    const guideline = await storage.updateAdmissionGuideline(id, input);
    if (!guideline) {
      return res.status(404).json({ error: "모집요강을 찾을 수 없습니다", code: "ADMISSION_NOT_FOUND" });
    }
    auditEvent(req, "admission.update", `admission:${id}`);
    return res.json(guideline);
  }));

  app.delete("/api/admissions/:id", adminOnly, asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    if (!id) return;
    if (!await storage.getAdmissionGuideline(id)) {
      return res.status(404).json({ error: "모집요강을 찾을 수 없습니다", code: "ADMISSION_NOT_FOUND" });
    }
    await storage.deleteAdmissionGuideline(id);
    auditEvent(req, "admission.delete", `admission:${id}`);
    return res.json({ success: true });
  }));

  app.patch("/api/admissions/:id/views", viewLimiter, asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    if (!id) return;
    const views = await storage.incrementAdmissionGuidelineViews(id);
    if (views === undefined) {
      return res.status(404).json({ error: "모집요강을 찾을 수 없습니다", code: "ADMISSION_NOT_FOUND" });
    }
    return res.json({ success: true, views });
  }));

  app.get("/api/notices", asyncHandler(async (req, res) => {
    const notices = await storage.getNotices();
    res.json(await Promise.all(notices.map(async notice => ({
      ...notice,
      comments: (await storage.getNoticeComments(notice.id)).map(comment => publicComment(req, comment)),
    }))));
  }));

  app.get("/api/notices/:id", asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    if (!id) return;
    const notice = await storage.getNotice(id);
    if (!notice) return res.status(404).json({ error: "공지사항을 찾을 수 없습니다", code: "NOTICE_NOT_FOUND" });
    return res.json({ ...notice, comments: (await storage.getNoticeComments(id)).map(comment => publicComment(req, comment)) });
  }));

  app.post("/api/notices", adminOnly, asyncHandler(async (req, res) => {
    const input = parseBody(noticeCreateSchema, req, res);
    if (!input) return;
    const notice = await storage.createNotice({ ...input, views: 0 });
    auditEvent(req, "notice.create", `notice:${notice.id}`);
    return res.status(201).json({ ...notice, comments: [] });
  }));

  app.patch("/api/notices/:id", adminOnly, asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    const input = parseBody(noticeUpdateSchema, req, res);
    if (!id || !input) return;
    const notice = await storage.updateNotice(id, input);
    if (!notice) return res.status(404).json({ error: "공지사항을 찾을 수 없습니다", code: "NOTICE_NOT_FOUND" });
    auditEvent(req, "notice.update", `notice:${id}`);
    return res.json({ ...notice, comments: (await storage.getNoticeComments(id)).map(comment => publicComment(req, comment)) });
  }));

  app.delete("/api/notices/:id", adminOnly, asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    if (!id) return;
    if (!await storage.getNotice(id)) return res.status(404).json({ error: "공지사항을 찾을 수 없습니다", code: "NOTICE_NOT_FOUND" });
    await storage.deleteNotice(id);
    auditEvent(req, "notice.delete", `notice:${id}`);
    return res.json({ success: true });
  }));

  app.patch("/api/notices/:id/views", viewLimiter, asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    if (!id) return;
    if (!await storage.getNotice(id)) return res.status(404).json({ error: "공지사항을 찾을 수 없습니다", code: "NOTICE_NOT_FOUND" });
    await storage.incrementNoticeViews(id);
    return res.json({ success: true });
  }));

  app.post("/api/notices/:id/comments", adminOnly, commentLimiter, asyncHandler(async (req, res) => {
    const noticeId = parseId(req, res);
    const input = parseBody(commentSchema, req, res);
    if (!noticeId || !input) return;
    if (!await storage.getNotice(noticeId)) return res.status(404).json({ error: "공지사항을 찾을 수 없습니다", code: "NOTICE_NOT_FOUND" });
    const comment = await storage.createNoticeComment({
      noticeId,
      userId: req.session.user!.id > 0 ? req.session.user!.id : null,
      author: req.session.user!.role === "ADMIN" ? "관리자" : req.session.user!.username,
      content: input.content,
      date: currentKoreanDateTime().registeredAt,
    });
    auditEvent(req, "notice_comment.create", `comment:${comment.id}`);
    return res.status(201).json(publicComment(req, comment));
  }));

  app.patch("/api/notice-comments/:id", adminOnly, asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    const input = parseBody(commentSchema, req, res);
    if (!id || !input) return;
    const existing = await storage.getNoticeComment(id);
    if (!existing) return res.status(404).json({ error: "댓글을 찾을 수 없습니다", code: "COMMENT_NOT_FOUND" });
    if (req.session.user!.role !== "ADMIN" && existing.userId !== req.session.user!.id) {
      return res.status(403).json({ error: "댓글을 수정할 권한이 없습니다", code: "FORBIDDEN" });
    }
    const comment = await storage.updateNoticeComment(id, input.content);
    auditEvent(req, "notice_comment.update", `comment:${id}`);
    return res.json(publicComment(req, comment!));
  }));

  app.delete("/api/notice-comments/:id", adminOnly, asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    if (!id) return;
    const existing = await storage.getNoticeComment(id);
    if (!existing) return res.status(404).json({ error: "댓글을 찾을 수 없습니다", code: "COMMENT_NOT_FOUND" });
    if (req.session.user!.role !== "ADMIN" && existing.userId !== req.session.user!.id) {
      return res.status(403).json({ error: "댓글을 삭제할 권한이 없습니다", code: "FORBIDDEN" });
    }
    await storage.deleteNoticeComment(id);
    auditEvent(req, "notice_comment.delete", `comment:${id}`);
    return res.json({ success: true });
  }));

  app.get("/api/papers", asyncHandler(async (req, res) => {
    const papers = await storage.getPapers();
    res.json(await Promise.all(papers.map(async paper => ({
      ...paper,
      comments: (await storage.getPaperComments(paper.id)).map(comment => publicComment(req, comment)),
    }))));
  }));

  app.get("/api/papers/:id", asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    if (!id) return;
    const paper = await storage.getPaper(id);
    if (!paper) return res.status(404).json({ error: "논문을 찾을 수 없습니다", code: "PAPER_NOT_FOUND" });
    return res.json({ ...paper, comments: (await storage.getPaperComments(id)).map(comment => publicComment(req, comment)) });
  }));

  app.post("/api/papers", adminOnly, asyncHandler(async (req, res) => {
    const input = parseBody(paperCreateSchema, req, res);
    if (!input) return;
    const paper = await storage.createPaper({ ...input, views: 0 });
    auditEvent(req, "paper.create", `paper:${paper.id}`);
    return res.status(201).json({ ...paper, comments: [] });
  }));

  app.patch("/api/papers/:id", adminOnly, asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    const input = parseBody(paperUpdateSchema, req, res);
    if (!id || !input) return;
    const paper = await storage.updatePaper(id, input);
    if (!paper) return res.status(404).json({ error: "논문을 찾을 수 없습니다", code: "PAPER_NOT_FOUND" });
    auditEvent(req, "paper.update", `paper:${id}`);
    return res.json({ ...paper, comments: (await storage.getPaperComments(id)).map(comment => publicComment(req, comment)) });
  }));

  app.delete("/api/papers/:id", adminOnly, asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    if (!id) return;
    if (!await storage.getPaper(id)) return res.status(404).json({ error: "논문을 찾을 수 없습니다", code: "PAPER_NOT_FOUND" });
    await storage.deletePaper(id);
    auditEvent(req, "paper.delete", `paper:${id}`);
    return res.json({ success: true });
  }));

  app.patch("/api/papers/:id/views", viewLimiter, asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    if (!id) return;
    if (!await storage.getPaper(id)) return res.status(404).json({ error: "논문을 찾을 수 없습니다", code: "PAPER_NOT_FOUND" });
    await storage.incrementPaperViews(id);
    return res.json({ success: true });
  }));

  app.post("/api/papers/:id/comments", adminOnly, commentLimiter, asyncHandler(async (req, res) => {
    const paperId = parseId(req, res);
    const input = parseBody(commentSchema, req, res);
    if (!paperId || !input) return;
    if (!await storage.getPaper(paperId)) return res.status(404).json({ error: "논문을 찾을 수 없습니다", code: "PAPER_NOT_FOUND" });
    const comment = await storage.createPaperComment({
      paperId,
      userId: req.session.user!.id > 0 ? req.session.user!.id : null,
      author: req.session.user!.role === "ADMIN" ? "관리자" : req.session.user!.username,
      content: input.content,
      date: currentKoreanDateTime().registeredAt,
    });
    auditEvent(req, "paper_comment.create", `comment:${comment.id}`);
    return res.status(201).json(publicComment(req, comment));
  }));

  app.patch("/api/paper-comments/:id", adminOnly, asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    const input = parseBody(commentSchema, req, res);
    if (!id || !input) return;
    const existing = await storage.getPaperComment(id);
    if (!existing) return res.status(404).json({ error: "댓글을 찾을 수 없습니다", code: "COMMENT_NOT_FOUND" });
    if (req.session.user!.role !== "ADMIN" && existing.userId !== req.session.user!.id) {
      return res.status(403).json({ error: "댓글을 수정할 권한이 없습니다", code: "FORBIDDEN" });
    }
    const comment = await storage.updatePaperComment(id, input.content);
    auditEvent(req, "paper_comment.update", `comment:${id}`);
    return res.json(publicComment(req, comment!));
  }));

  app.delete("/api/paper-comments/:id", adminOnly, asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    if (!id) return;
    const existing = await storage.getPaperComment(id);
    if (!existing) return res.status(404).json({ error: "댓글을 찾을 수 없습니다", code: "COMMENT_NOT_FOUND" });
    if (req.session.user!.role !== "ADMIN" && existing.userId !== req.session.user!.id) {
      return res.status(403).json({ error: "댓글을 삭제할 권한이 없습니다", code: "FORBIDDEN" });
    }
    await storage.deletePaperComment(id);
    auditEvent(req, "paper_comment.delete", `comment:${id}`);
    return res.json({ success: true });
  }));

  app.all("/api/talents", (_req, res) => res.status(410).json({
    error: "인재풀 등록 기능은 종료되었습니다. 이메일 문의를 이용해주세요",
    code: "TALENT_API_RETIRED",
  }));
  app.all("/api/talents/:id", (_req, res) => res.status(410).json({
    error: "인재풀 등록 기능은 종료되었습니다",
    code: "TALENT_API_RETIRED",
  }));

  return httpServer;
}
