import type { Express, NextFunction, Request, RequestHandler, Response } from "express";
import type { Server } from "http";
import { randomBytes, randomUUID } from "crypto";
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
const signupLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5 });
const talentLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 3 });
const commentLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 10 });
const viewLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 120 });
const uploadLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

const usernameSchema = z.string().trim().min(4).max(32).regex(/^[A-Za-z0-9._-]+$/);
const passwordSchema = z.string().min(10).max(128);
const nameSchema = z.string().trim().min(1).max(80);
const emailSchema = z.string().trim().email().max(254).transform(value => value.toLowerCase());
const dateSchema = z.string().trim().regex(/^\d{4}[.-]\d{2}[.-]\d{2}$/);
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

const signupSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  name: nameSchema,
  email: emailSchema,
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

const talentCreateSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: z.string().trim().min(7).max(30),
  education: z.string().trim().min(1).max(80),
  major: z.string().trim().min(1).max(120),
  interestedMajor: z.string().trim().min(1).max(120),
  motivation: z.string().trim().max(2_000),
  consent: z.literal(true),
});
const talentUpdateSchema = talentCreateSchema
  .omit({ consent: true })
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

function publicComment<T extends { userId?: number | null }>(req: Request, comment: T) {
  const { userId: _userId, ...dto } = comment;
  return {
    ...dto,
    canEdit: Boolean(req.session.user)
      && (req.session.user!.role === "ADMIN" || comment.userId === req.session.user!.id),
  };
}

function publicUser(user: {
  id: number;
  username: string;
  name: string;
  email: string;
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
    email: user.email,
    role: user.role,
    status: user.status,
    passwordResetRequired: user.passwordResetRequired,
    registeredAt: user.registeredAt,
    registeredTime: user.registeredTime,
  };
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
  const adminOnly = requireRole("ADMIN");

  app.get("/uploads/:filename", requireAuth, asyncHandler(async (req, res) => {
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

  app.get("/api/users", adminOnly, asyncHandler(async (_req, res) => {
    res.json((await storage.getUsers()).map(publicUser));
  }));

  app.post("/api/users", signupLimiter, asyncHandler(async (req, res) => {
    const input = parseBody(signupSchema, req, res);
    if (!input) return;
    if (await storage.getUserByUsername(input.username)) {
      return res.status(409).json({ error: "이미 사용 중인 아이디입니다", code: "USERNAME_TAKEN" });
    }
    const user = await storage.createUser({
      username: input.username,
      password: await hashPassword(input.password),
      name: input.name,
      email: input.email,
      ...currentKoreanDateTime(),
    });
    auditEvent(req, "user.signup", `user:${user.id}`);
    return res.status(201).json(publicUser(user));
  }));

  app.post("/api/users/login", loginLimiter, asyncHandler(async (req, res) => {
    const input = parseBody(loginSchema, req, res);
    if (!input) return;

    const configuredAdminUsername = process.env.ADMIN_USERNAME?.trim();
    const configuredAdminHash = process.env.ADMIN_PASSWORD_HASH?.trim();
    if (configuredAdminUsername && input.username === configuredAdminUsername) {
      const valid = configuredAdminHash
        ? await verifyPassword(input.password, configuredAdminHash)
        : await verifyPassword(input.password, await dummyPasswordHash);
      if (!valid) {
        auditEvent(req, "auth.login_failed", "admin");
        return res.status(401).json({ error: "아이디 또는 비밀번호가 올바르지 않습니다", code: "INVALID_CREDENTIALS" });
      }
      await sessionRegenerate(req);
      req.session.user = { id: 0, username: configuredAdminUsername, name: "관리자", role: "ADMIN" };
      req.session.createdAt = Date.now();
      await sessionSave(req);
      auditEvent(req, "auth.login_success", "admin");
      return res.json(req.session.user);
    }

    const user = await storage.getUserByUsername(input.username);
    if (!user) {
      await verifyPassword(input.password, await dummyPasswordHash);
      auditEvent(req, "auth.login_failed", "user");
      return res.status(401).json({ error: "아이디 또는 비밀번호가 올바르지 않습니다", code: "INVALID_CREDENTIALS" });
    }
    if (user.status !== "active") {
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
      role: user.role === "admin" ? "ADMIN" : "USER",
    };
    req.session.createdAt = Date.now();
    await sessionSave(req);
    auditEvent(req, "auth.login_success", `user:${user.id}`);
    return res.json(req.session.user);
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

  app.get("/api/users/me", requireAuth, (req, res) => res.json(req.session.user));

  app.patch("/api/users/:id/password", adminOnly, asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    const input = parseBody(passwordResetSchema, req, res);
    if (!id || !input) return;
    if (!await storage.getUser(id)) return res.status(404).json({ error: "회원을 찾을 수 없습니다", code: "USER_NOT_FOUND" });
    await storage.updateUserPassword(id, await hashPassword(input.password));
    auditEvent(req, "user.password_reset", `user:${id}`);
    return res.json({ success: true });
  }));

  app.delete("/api/users/:id", adminOnly, asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    if (!id) return;
    if (!await storage.getUser(id)) return res.status(404).json({ error: "회원을 찾을 수 없습니다", code: "USER_NOT_FOUND" });
    await storage.deleteUser(id);
    auditEvent(req, "user.delete", `user:${id}`);
    return res.json({ success: true });
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

  app.post("/api/notices/:id/comments", requireAuth, commentLimiter, asyncHandler(async (req, res) => {
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

  app.patch("/api/notice-comments/:id", requireAuth, asyncHandler(async (req, res) => {
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

  app.delete("/api/notice-comments/:id", requireAuth, asyncHandler(async (req, res) => {
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

  app.post("/api/papers/:id/comments", requireAuth, commentLimiter, asyncHandler(async (req, res) => {
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

  app.patch("/api/paper-comments/:id", requireAuth, asyncHandler(async (req, res) => {
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

  app.delete("/api/paper-comments/:id", requireAuth, asyncHandler(async (req, res) => {
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

  app.get("/api/talents", adminOnly, asyncHandler(async (_req, res) => {
    res.json(await storage.getTalents());
  }));

  app.get("/api/talents/:id", adminOnly, asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    if (!id) return;
    const talent = await storage.getTalent(id);
    if (!talent) return res.status(404).json({ error: "인재풀 정보를 찾을 수 없습니다", code: "TALENT_NOT_FOUND" });
    return res.json(talent);
  }));

  app.post("/api/talents", talentLimiter, asyncHandler(async (req, res) => {
    const input = parseBody(talentCreateSchema, req, res);
    if (!input) return;
    const { consent: _consent, ...talentInput } = input;
    const consentAt = new Date();
    const retentionUntil = new Date(consentAt);
    retentionUntil.setUTCFullYear(retentionUntil.getUTCFullYear() + 2);
    const talent = await storage.createTalent({
      ...talentInput,
      ...currentKoreanDateTime(),
      consentAt,
      retentionUntil,
    });
    auditEvent(req, "talent.create", `talent:${talent.id}`);
    return res.status(201).json({ success: true, id: talent.id });
  }));

  app.patch("/api/talents/:id", adminOnly, asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    const input = parseBody(talentUpdateSchema, req, res);
    if (!id || !input) return;
    const talent = await storage.updateTalent(id, input);
    if (!talent) return res.status(404).json({ error: "인재풀 정보를 찾을 수 없습니다", code: "TALENT_NOT_FOUND" });
    auditEvent(req, "talent.update", `talent:${id}`);
    return res.json(talent);
  }));

  app.delete("/api/talents/:id", adminOnly, asyncHandler(async (req, res) => {
    const id = parseId(req, res);
    if (!id) return;
    if (!await storage.getTalent(id)) return res.status(404).json({ error: "인재풀 정보를 찾을 수 없습니다", code: "TALENT_NOT_FOUND" });
    await storage.deleteTalent(id);
    auditEvent(req, "talent.delete", `talent:${id}`);
    return res.json({ success: true });
  }));

  return httpServer;
}
