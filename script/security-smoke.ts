import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import express from "express";
import session from "express-session";
import { registerRoutes } from "../server/routes";
import {
  hashPassword,
  isPasswordHash,
  isSafeHttpUrl,
  rateLimit,
  requestIdMiddleware,
  requireAuth,
  requireRole,
  requireSameOrigin,
  resolveSessionSecret,
  verifyPassword,
} from "../server/security";
import { MemoryStorage } from "../server/storage";

function mockRequest(overrides: Record<string, unknown> = {}) {
  const headers = new Map<string, string>();
  const providedHeaders = overrides.headers as Record<string, string> | undefined;
  Object.entries(providedHeaders ?? {}).forEach(([name, value]) => headers.set(name.toLowerCase(), value));
  return {
    method: "POST",
    protocol: "https",
    ip: "127.0.0.1",
    socket: { remoteAddress: "127.0.0.1" },
    session: {},
    get(name: string) { return headers.get(name.toLowerCase()); },
    ...overrides,
  } as any;
}

function mockResponse() {
  return {
    statusCode: 200,
    body: undefined as unknown,
    headers: {} as Record<string, string>,
    status(code: number) { this.statusCode = code; return this; },
    json(body: unknown) { this.body = body; return this; },
    setHeader(name: string, value: string) { this.headers[name] = String(value); },
  } as any;
}

const testPassword = () => randomBytes(24).toString("base64url");
const password = testPassword();
const wrongPassword = testPassword();
const hash = await hashPassword(password);

const routesSource = await readFile(new URL("../server/routes.ts", import.meta.url), "utf8");
const publicRoutes = [
  ["get", "/uploads/:filename", "downloadLimiter, asyncHandler"],
] as const;
const routeSourceLines = routesSource.split(/\r?\n/);
for (const [method, route, middleware] of publicRoutes) {
  const declaration = routeSourceLines.find(line => line.includes(`app.${method}("${route}"`));
  assert.ok(
    declaration?.includes(middleware),
    `${method.toUpperCase()} ${route} must remain public and rate-limited`,
  );
  assert.equal(declaration.includes("adminOnly"), false);
}
for (const [method, route, limiter] of [
  ["post", "/api/notices", "publicContentMutationLimiter"],
  ["patch", "/api/notices/:id", "publicContentMutationLimiter"],
  ["delete", "/api/notices/:id", "publicContentMutationLimiter"],
  ["post", "/api/admissions", "publicContentMutationLimiter"],
  ["patch", "/api/admissions/:id", "publicContentMutationLimiter"],
  ["delete", "/api/admissions/:id", "publicContentMutationLimiter"],
  ["post", "/api/papers", "publicContentMutationLimiter"],
  ["patch", "/api/papers/:id", "publicContentMutationLimiter"],
  ["delete", "/api/papers/:id", "publicContentMutationLimiter"],
  ["post", "/api/upload", "uploadLimiter"],
] as const) {
  const declaration = routeSourceLines.find(line => line.includes(`app.${method}("${route}"`));
  assert.ok(
    declaration?.includes("adminOnly"),
    `${method.toUpperCase()} ${route} must remain administrator-only`,
  );
  assert.ok(
    declaration.includes(limiter),
    `${method.toUpperCase()} ${route} must remain rate-limited`,
  );
  assert.ok(
    declaration.indexOf("adminOnly") < declaration.indexOf(limiter),
    `${method.toUpperCase()} ${route} must authenticate before applying the mutation limiter`,
  );
}
for (const [method, route] of [
  ["post", "/api/papers/:id/comments"],
  ["patch", "/api/paper-comments/:id"],
  ["delete", "/api/paper-comments/:id"],
] as const) {
  assert.ok(
    routesSource.includes(`app.${method}("${route}", retiredPaperCommentWrite)`),
    `${method.toUpperCase()} ${route} must remain retired`,
  );
}
assert.equal(routesSource.includes("storage.getPaperComments"), false);
assert.equal((routesSource.match(/await ensureBootstrapCode\(\);/g) ?? []).length, 1);

assert.equal(isPasswordHash(hash), true);
assert.equal(isPasswordHash("scrypt$v1$16384$8$1$invalid$invalid"), false);
assert.equal(hash.includes(password), false);
assert.equal(await verifyPassword(password, hash), true);
assert.equal(await verifyPassword(wrongPassword, hash), false);
assert.equal(isSafeHttpUrl("https://example.edu/paper"), true);
assert.equal(isSafeHttpUrl("javascript:alert(1)"), false);

const configuredSession = resolveSessionSecret("x".repeat(32), true);
assert.equal(configuredSession.source, "configured");
assert.equal(configuredSession.reason, null);

const generatedSession = resolveSessionSecret("short-secret", true);
assert.equal(generatedSession.source, "generated");
assert.equal(generatedSession.reason, "too_short");
assert.ok(generatedSession.secret.length >= 64);
assert.notEqual(generatedSession.secret, "short-secret");

let nextCalls = 0;
const unauthenticatedResponse = mockResponse();
requireAuth(mockRequest(), unauthenticatedResponse, () => { nextCalls += 1; });
assert.equal(unauthenticatedResponse.statusCode, 401);
assert.equal(nextCalls, 0);

const forbiddenResponse = mockResponse();
requireRole("ADMIN")(mockRequest({ session: { user: { role: "USER" } } }), forbiddenResponse, () => { nextCalls += 1; });
assert.equal(forbiddenResponse.statusCode, 403);
assert.equal(nextCalls, 0);

const authorizedResponse = mockResponse();
requireRole("ADMIN")(mockRequest({ session: { user: { role: "ADMIN" } } }), authorizedResponse, () => { nextCalls += 1; });
assert.equal(nextCalls, 1);

const originalNodeEnv = process.env.NODE_ENV;
process.env.NODE_ENV = "production";
try {
  const sameOriginResponse = mockResponse();
  requireSameOrigin(
    mockRequest({ headers: { origin: "https://graduate.example", host: "graduate.example", "sec-fetch-site": "same-origin" } }),
    sameOriginResponse,
    () => { nextCalls += 1; },
  );
  assert.equal(nextCalls, 2);

  const crossOriginResponse = mockResponse();
  requireSameOrigin(
    mockRequest({ headers: { origin: "https://untrusted.example", host: "graduate.example", "sec-fetch-site": "cross-site" } }),
    crossOriginResponse,
    () => { nextCalls += 1; },
  );
  assert.equal(crossOriginResponse.statusCode, 403);

  const missingOriginResponse = mockResponse();
  requireSameOrigin(mockRequest({ headers: { host: "graduate.example" } }), missingOriginResponse, () => { nextCalls += 1; });
  assert.equal(missingOriginResponse.statusCode, 403);
} finally {
  if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = originalNodeEnv;
}

const limiter = rateLimit({ windowMs: 60_000, max: 2 });
const firstLimitResponse = mockResponse();
const secondLimitResponse = mockResponse();
const blockedLimitResponse = mockResponse();
limiter(mockRequest(), firstLimitResponse, () => { nextCalls += 1; });
limiter(mockRequest(), secondLimitResponse, () => { nextCalls += 1; });
limiter(mockRequest(), blockedLimitResponse, () => { nextCalls += 1; });
assert.equal(blockedLimitResponse.statusCode, 429);
assert.equal(blockedLimitResponse.headers["Retry-After"] !== undefined, true);

const storage = new MemoryStorage();
const firstAdmin = await storage.createAdmin({
  username: "first-admin",
  password: await hashPassword(testPassword()),
  name: "First Admin",
  registeredAt: "2026.08.23",
  registeredTime: "12:00",
});
assert.equal(await storage.getActiveAdminCount(), 1);
const firstAdminVersion = firstAdmin.authVersion;
await storage.updateUserPassword(firstAdmin.id, await hashPassword(testPassword()));
assert.equal((await storage.getUser(firstAdmin.id))?.authVersion, firstAdminVersion + 1);
assert.equal(await storage.deleteAdminSafely(firstAdmin.id, false), "last_admin");

const secondAdmin = await storage.createAdmin({
  username: "second-admin",
  password: await hashPassword(testPassword()),
  name: "Second Admin",
  registeredAt: "2026.08.23",
  registeredTime: "12:01",
});
assert.equal(await storage.deleteAdminSafely(secondAdmin.id, false), "deleted");
assert.equal(await storage.getActiveAdminCount(), 1);

const recoveryStorage = new MemoryStorage();
const legacyPlaintext = testPassword();
const legacyAdmin = await recoveryStorage.createAdmin({
  username: "legacy-admin",
  password: legacyPlaintext,
  name: "Legacy Admin",
  registeredAt: "2025.01.01",
  registeredTime: "09:00",
});
assert.equal(await recoveryStorage.getActiveAdminCount(), 0);
const recovered = await recoveryStorage.createFirstAdminSafely({
  username: "legacy-admin",
  password: await hashPassword(testPassword()),
  name: "Recovered Admin",
  registeredAt: "2026.08.23",
  registeredTime: "12:02",
});
assert.equal(recovered.status, "created");
if (recovered.status === "created") assert.equal(recovered.admin.id, legacyAdmin.id);
assert.equal(await recoveryStorage.getActiveAdminCount(), 1);
assert.equal((await recoveryStorage.createFirstAdminSafely({
  username: "another-admin",
  password: await hashPassword(testPassword()),
  name: "Another Admin",
  registeredAt: "2026.08.23",
  registeredTime: "12:03",
})).status, "already_exists");

const guideline = await storage.createAdmissionGuideline({
  title: "Graduate admission guide",
  content: "Official application information",
  organization: "Dankook University Graduate School",
  date: "2026-08-23",
  views: 0,
  attachmentUrl: "https://grad.dankook.ac.kr/-91",
  attachmentName: "Official guide",
});
assert.equal(await storage.incrementAdmissionGuidelineViews(guideline.id), 1);
assert.equal((await storage.getAdmissionGuideline(guideline.id))?.views, 1);

const olderGuideline = await storage.createAdmissionGuideline({
  title: "Older admission guide",
  content: "Older official application information",
  organization: "Dankook University Graduate School",
  date: "2025-12-01",
  views: 0,
  attachmentUrl: null,
  attachmentName: null,
});
const newestGuideline = await storage.createAdmissionGuideline({
  title: "Newest admission guide",
  content: "Newest official application information",
  organization: "Dankook University Graduate School",
  date: "2027-01-15",
  views: 0,
  attachmentUrl: null,
  attachmentName: null,
});
const sameDateGuideline = await storage.createAdmissionGuideline({
  title: "Same-date admission guide",
  content: "Same-date official application information",
  organization: "Dankook University Graduate School",
  date: "2027-01-15",
  views: 0,
  attachmentUrl: null,
  attachmentName: null,
});
assert.deepEqual(
  (await storage.getAdmissionGuidelines()).map((item) => item.id),
  [sameDateGuideline.id, newestGuideline.id, guideline.id, olderGuideline.id],
);

const updatedGuideline = await storage.updateAdmissionGuideline(guideline.id, { title: "Updated graduate admission guide" });
assert.equal(updatedGuideline?.title, "Updated graduate admission guide");
await storage.deleteAdmissionGuideline(olderGuideline.id);
assert.equal(await storage.getAdmissionGuideline(olderGuideline.id), undefined);

const notice = await storage.createNotice({
  title: "Operations notice",
  content: "Administrator-managed notice content",
  date: "2026.08.24",
  views: 0,
  isImportant: false,
  files: [],
});
assert.equal((await storage.updateNotice(notice.id, { title: "Updated operations notice" }))?.title, "Updated operations notice");
await storage.deleteNotice(notice.id);
assert.equal(await storage.getNotice(notice.id), undefined);

const paper = await storage.createPaper({
  category: "journal",
  title: "Operations paper",
  authors: "Dankook Graduate School",
  firstAuthor: null,
  correspondingAuthor: null,
  venue: null,
  journal: null,
  volume: null,
  year: "2026",
  abstract: null,
  keywords: [],
  files: [],
  websiteUrl: "https://example.edu/paper",
  date: "2026.08.24",
  views: 0,
});
assert.equal((await storage.updatePaper(paper.id, { title: "Updated operations paper" }))?.title, "Updated operations paper");
await storage.deletePaper(paper.id);
assert.equal(await storage.getPaper(paper.id), undefined);

const integrationStorage = new MemoryStorage();
const integrationAdminPassword = testPassword();
const integrationAdmin = await integrationStorage.createAdmin({
  username: `admin-${randomBytes(8).toString("hex")}`,
  password: await hashPassword(integrationAdminPassword),
  name: "Integration Admin",
  registeredAt: "2026.08.31",
  registeredTime: "18:00",
});
const protectedNotice = await integrationStorage.createNotice({
  title: "Protected notice integration fixture",
  content: "This fixture must not change without an administrator session",
  date: "2026.08.31",
  views: 0,
  isImportant: false,
  files: [],
});
const protectedAdmission = await integrationStorage.createAdmissionGuideline({
  title: "Protected admission integration fixture",
  content: "This fixture must not change without an administrator session",
  organization: "Dankook Graduate School",
  date: "2026-08-31",
  views: 0,
  attachmentUrl: null,
  attachmentName: null,
});
const protectedPaper = await integrationStorage.createPaper({
  category: "conference",
  title: "Protected conference integration fixture",
  authors: "Dankook Graduate School",
  firstAuthor: null,
  correspondingAuthor: null,
  venue: "Security Integration Conference",
  journal: null,
  volume: null,
  year: "2026",
  abstract: null,
  keywords: [],
  files: [],
  websiteUrl: "https://example.edu/protected-conference",
  date: "2026.08.31",
  views: 0,
});
const integrationApp = express();
const integrationServer = createServer(integrationApp);
const integrationNodeEnv = process.env.NODE_ENV;
const originalConsoleInfo = console.info;
let integrationAdmissionId: number | null = null;
let integrationNoticeId: number | null = null;
let integrationPaperId: number | null = null;

process.env.NODE_ENV = "production";
console.info = () => {};
integrationApp.set("trust proxy", 1);
integrationApp.use(requestIdMiddleware);
integrationApp.use(express.json({ limit: "256kb" }));
integrationApp.use(session({
  secret: randomBytes(32).toString("base64url"),
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", secure: false },
}));
integrationApp.use("/api", requireSameOrigin);

try {
  await registerRoutes(integrationServer, integrationApp, integrationStorage);
  await new Promise<void>((resolve, reject) => {
    integrationServer.once("error", reject);
    integrationServer.listen(0, "127.0.0.1", resolve);
  });
  const address = integrationServer.address();
  assert.ok(address && typeof address === "object");
  const baseUrl = `http://127.0.0.1:${address.port}`;

  async function request(method: string, route: string, body?: unknown, origin = baseUrl, cookie?: string) {
    return await fetch(`${baseUrl}${route}`, {
      method,
      headers: {
        Origin: origin,
        "Sec-Fetch-Site": origin === baseUrl ? "same-origin" : "cross-site",
        ...(cookie ? { Cookie: cookie } : {}),
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  const admissionInput = {
    title: "Administrator admission integration test",
    content: "Memory-only admission content",
    organization: "Dankook Graduate School",
    date: "2026-08-24",
    attachmentUrl: null,
    attachmentName: null,
  };
  const paperInput = {
    category: "journal",
    title: "Administrator journal integration test",
    authors: "Dankook Graduate School",
    firstAuthor: null,
    correspondingAuthor: null,
    venue: null,
    journal: "Security Integration Journal",
    volume: null,
    year: "2026",
    abstract: null,
    keywords: [],
    files: [],
    websiteUrl: "https://example.edu/administrator-paper",
    date: "2026.08.24",
  };

  const admissionCountBeforeUnauthorizedRequests = (await integrationStorage.getAdmissionGuidelines()).length;
  const unauthorizedAdmissionCreateResponse = await request("POST", "/api/admissions", admissionInput);
  assert.equal(unauthorizedAdmissionCreateResponse.status, 401);
  assert.equal((await unauthorizedAdmissionCreateResponse.json() as { code: string }).code, "AUTH_REQUIRED");
  assert.equal((await integrationStorage.getAdmissionGuidelines()).length, admissionCountBeforeUnauthorizedRequests);

  const unauthorizedAdmissionPatchResponse = await request(
    "PATCH",
    `/api/admissions/${protectedAdmission.id}`,
    { title: "Unauthorized admission update must not persist" },
  );
  assert.equal(unauthorizedAdmissionPatchResponse.status, 401);
  assert.equal(
    (await integrationStorage.getAdmissionGuideline(protectedAdmission.id))?.title,
    protectedAdmission.title,
  );

  const unauthorizedAdmissionDeleteResponse = await request(
    "DELETE",
    `/api/admissions/${protectedAdmission.id}`,
  );
  assert.equal(unauthorizedAdmissionDeleteResponse.status, 401);
  assert.ok(await integrationStorage.getAdmissionGuideline(protectedAdmission.id));

  const paperCountBeforeUnauthorizedRequests = (await integrationStorage.getPapers()).length;
  const unauthorizedPaperCreateResponse = await request("POST", "/api/papers", paperInput);
  assert.equal(unauthorizedPaperCreateResponse.status, 401);
  assert.equal((await unauthorizedPaperCreateResponse.json() as { code: string }).code, "AUTH_REQUIRED");
  assert.equal((await integrationStorage.getPapers()).length, paperCountBeforeUnauthorizedRequests);

  const unauthorizedPaperPatchResponse = await request(
    "PATCH",
    `/api/papers/${protectedPaper.id}`,
    { title: "Unauthorized paper update must not persist" },
  );
  assert.equal(unauthorizedPaperPatchResponse.status, 401);
  assert.equal((await integrationStorage.getPaper(protectedPaper.id))?.title, protectedPaper.title);

  const unauthorizedPaperDeleteResponse = await request("DELETE", `/api/papers/${protectedPaper.id}`);
  assert.equal(unauthorizedPaperDeleteResponse.status, 401);
  assert.ok(await integrationStorage.getPaper(protectedPaper.id));

  const unauthorizedUploadResponse = await request("POST", "/api/upload");
  assert.equal(unauthorizedUploadResponse.status, 401);
  assert.equal((await unauthorizedUploadResponse.json() as { code: string }).code, "AUTH_REQUIRED");

  const noticeInput = {
    title: "Administrator notice integration test",
    content: "Memory-only notice content",
    date: "2026.08.24",
    isImportant: false,
    files: [],
  };
  const noticeCountBeforeUnauthorizedRequests = (await integrationStorage.getNotices()).length;
  const unauthorizedNoticeCreateResponse = await request("POST", "/api/notices", noticeInput);
  assert.equal(unauthorizedNoticeCreateResponse.status, 401);
  assert.equal((await unauthorizedNoticeCreateResponse.json() as { code: string }).code, "AUTH_REQUIRED");
  assert.equal((await integrationStorage.getNotices()).length, noticeCountBeforeUnauthorizedRequests);

  const unauthorizedNoticePatchResponse = await request(
    "PATCH",
    `/api/notices/${protectedNotice.id}`,
    { title: "Unauthorized update must not persist" },
  );
  assert.equal(unauthorizedNoticePatchResponse.status, 401);
  assert.equal((await integrationStorage.getNotice(protectedNotice.id))?.title, protectedNotice.title);

  const unauthorizedNoticeDeleteResponse = await request("DELETE", `/api/notices/${protectedNotice.id}`);
  assert.equal(unauthorizedNoticeDeleteResponse.status, 401);
  assert.ok(await integrationStorage.getNotice(protectedNotice.id));

  const loginResponse = await request("POST", "/api/users/login", {
    username: integrationAdmin.username,
    password: integrationAdminPassword,
  });
  assert.equal(loginResponse.status, 200);
  assert.equal((await loginResponse.json() as { role: string }).role, "ADMIN");
  const setCookie = loginResponse.headers.get("set-cookie");
  assert.ok(setCookie);
  assert.match(setCookie, /HttpOnly/i);
  assert.match(setCookie, /SameSite=Lax/i);
  const adminCookie = setCookie.split(";", 1)[0];

  const currentAdminResponse = await request("GET", "/api/users/me", undefined, baseUrl, adminCookie);
  assert.equal(currentAdminResponse.status, 200);
  assert.equal((await currentAdminResponse.json() as { role: string }).role, "ADMIN");

  const rejectedNoticeCount = (await integrationStorage.getNotices()).length;
  const rejectedNoticeOriginResponse = await request(
    "POST",
    "/api/notices",
    noticeInput,
    "https://untrusted.example",
    adminCookie,
  );
  assert.equal(rejectedNoticeOriginResponse.status, 403);
  assert.equal((await rejectedNoticeOriginResponse.json() as { code: string }).code, "ORIGIN_REJECTED");
  assert.equal((await integrationStorage.getNotices()).length, rejectedNoticeCount);

  const rejectedAdmissionCount = (await integrationStorage.getAdmissionGuidelines()).length;
  const rejectedAdmissionOriginCreateResponse = await request(
    "POST",
    "/api/admissions",
    admissionInput,
    "https://untrusted.example",
    adminCookie,
  );
  assert.equal(rejectedAdmissionOriginCreateResponse.status, 403);
  assert.equal(
    (await rejectedAdmissionOriginCreateResponse.json() as { code: string }).code,
    "ORIGIN_REJECTED",
  );
  assert.equal((await integrationStorage.getAdmissionGuidelines()).length, rejectedAdmissionCount);

  const rejectedAdmissionOriginPatchResponse = await request(
    "PATCH",
    `/api/admissions/${protectedAdmission.id}`,
    { title: "Cross-origin admission update must not persist" },
    "https://untrusted.example",
    adminCookie,
  );
  assert.equal(rejectedAdmissionOriginPatchResponse.status, 403);
  assert.equal(
    (await integrationStorage.getAdmissionGuideline(protectedAdmission.id))?.title,
    protectedAdmission.title,
  );

  const rejectedAdmissionOriginDeleteResponse = await request(
    "DELETE",
    `/api/admissions/${protectedAdmission.id}`,
    undefined,
    "https://untrusted.example",
    adminCookie,
  );
  assert.equal(rejectedAdmissionOriginDeleteResponse.status, 403);
  assert.ok(await integrationStorage.getAdmissionGuideline(protectedAdmission.id));

  const rejectedPaperCount = (await integrationStorage.getPapers()).length;
  const rejectedPaperOriginCreateResponse = await request(
    "POST",
    "/api/papers",
    paperInput,
    "https://untrusted.example",
    adminCookie,
  );
  assert.equal(rejectedPaperOriginCreateResponse.status, 403);
  assert.equal((await rejectedPaperOriginCreateResponse.json() as { code: string }).code, "ORIGIN_REJECTED");
  assert.equal((await integrationStorage.getPapers()).length, rejectedPaperCount);

  const rejectedPaperOriginPatchResponse = await request(
    "PATCH",
    `/api/papers/${protectedPaper.id}`,
    { title: "Cross-origin paper update must not persist" },
    "https://untrusted.example",
    adminCookie,
  );
  assert.equal(rejectedPaperOriginPatchResponse.status, 403);
  assert.equal((await integrationStorage.getPaper(protectedPaper.id))?.title, protectedPaper.title);

  const rejectedPaperOriginDeleteResponse = await request(
    "DELETE",
    `/api/papers/${protectedPaper.id}`,
    undefined,
    "https://untrusted.example",
    adminCookie,
  );
  assert.equal(rejectedPaperOriginDeleteResponse.status, 403);
  assert.ok(await integrationStorage.getPaper(protectedPaper.id));

  const rejectedUploadOriginResponse = await request(
    "POST",
    "/api/upload",
    undefined,
    "https://untrusted.example",
    adminCookie,
  );
  assert.equal(rejectedUploadOriginResponse.status, 403);
  assert.equal((await rejectedUploadOriginResponse.json() as { code: string }).code, "ORIGIN_REJECTED");

  const noticeCreateResponse = await request("POST", "/api/notices", noticeInput, baseUrl, adminCookie);
  assert.equal(noticeCreateResponse.status, 201);
  const integrationNotice = await noticeCreateResponse.json() as { id: number };
  integrationNoticeId = integrationNotice.id;
  assert.equal((await request(
    "PATCH",
    `/api/notices/${integrationNotice.id}`,
    { title: "Updated administrator notice" },
    baseUrl,
    adminCookie,
  )).status, 200);
  assert.equal((await request(
    "DELETE",
    `/api/notices/${integrationNotice.id}`,
    undefined,
    baseUrl,
    adminCookie,
  )).status, 200);
  assert.equal(await integrationStorage.getNotice(integrationNotice.id), undefined);

  const admissionCreateResponse = await request(
    "POST",
    "/api/admissions",
    admissionInput,
    baseUrl,
    adminCookie,
  );
  assert.equal(admissionCreateResponse.status, 201);
  const integrationAdmission = await admissionCreateResponse.json() as { id: number };
  integrationAdmissionId = integrationAdmission.id;
  const admissionPatchResponse = await request(
    "PATCH",
    `/api/admissions/${integrationAdmission.id}`,
    { title: "Updated administrator admission" },
    baseUrl,
    adminCookie,
  );
  assert.equal(admissionPatchResponse.status, 200);
  assert.equal(
    (await integrationStorage.getAdmissionGuideline(integrationAdmission.id))?.title,
    "Updated administrator admission",
  );
  assert.equal((await request(
    "DELETE",
    `/api/admissions/${integrationAdmission.id}`,
    undefined,
    baseUrl,
    adminCookie,
  )).status, 200);
  assert.equal(await integrationStorage.getAdmissionGuideline(integrationAdmission.id), undefined);

  const paperCreateResponse = await request(
    "POST",
    "/api/papers",
    paperInput,
    baseUrl,
    adminCookie,
  );
  assert.equal(paperCreateResponse.status, 201);
  const integrationPaper = await paperCreateResponse.json() as { id: number };
  integrationPaperId = integrationPaper.id;
  const paperGetResponse = await fetch(`${baseUrl}/api/papers/${integrationPaper.id}`);
  assert.equal(paperGetResponse.status, 200);
  assert.equal("comments" in await paperGetResponse.json() as Record<string, unknown>, false);
  const paperPatchResponse = await request(
    "PATCH",
    `/api/papers/${integrationPaper.id}`,
    { title: "Updated administrator journal" },
    baseUrl,
    adminCookie,
  );
  assert.equal(paperPatchResponse.status, 200);
  assert.equal(
    (await integrationStorage.getPaper(integrationPaper.id))?.title,
    "Updated administrator journal",
  );

  assert.equal((await request("POST", `/api/papers/${integrationPaper.id}/comments`, { content: "Retired" })).status, 410);
  assert.equal((await request("PATCH", "/api/paper-comments/1", { content: "Retired" })).status, 410);
  assert.equal((await request("DELETE", "/api/paper-comments/1")).status, 410);

  assert.equal((await request(
    "DELETE",
    `/api/papers/${integrationPaper.id}`,
    undefined,
    baseUrl,
    adminCookie,
  )).status, 200);
  assert.equal(await integrationStorage.getPaper(integrationPaper.id), undefined);
} finally {
  if (integrationAdmissionId !== null) await integrationStorage.deleteAdmissionGuideline(integrationAdmissionId);
  if (integrationNoticeId !== null) await integrationStorage.deleteNotice(integrationNoticeId);
  if (integrationPaperId !== null) await integrationStorage.deletePaper(integrationPaperId);
  await integrationStorage.deleteAdmissionGuideline(protectedAdmission.id);
  await integrationStorage.deleteNotice(protectedNotice.id);
  await integrationStorage.deletePaper(protectedPaper.id);
  await new Promise<void>((resolve, reject) => {
    if (!integrationServer.listening) return resolve();
    integrationServer.close(error => error ? reject(error) : resolve());
  });
  console.info = originalConsoleInfo;
  if (integrationNodeEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = integrationNodeEnv;
}

console.log("Security smoke checks passed");
