import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import {
  hashPassword,
  isPasswordHash,
  isSafeHttpUrl,
  rateLimit,
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

console.log("Security smoke checks passed");
