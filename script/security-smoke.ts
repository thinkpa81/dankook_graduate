import assert from "node:assert/strict";
import {
  hashPassword,
  isPasswordHash,
  isSafeHttpUrl,
  resolveSessionSecret,
  verifyPassword,
} from "../server/security";
import { MemoryStorage } from "../server/storage";

const password = "correct-horse-battery-staple";
const hash = await hashPassword(password);

assert.equal(isPasswordHash(hash), true);
assert.equal(isPasswordHash("scrypt$v1$16384$8$1$invalid$invalid"), false);
assert.equal(hash.includes(password), false);
assert.equal(await verifyPassword(password, hash), true);
assert.equal(await verifyPassword("wrong-password", hash), false);
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

const storage = new MemoryStorage();
const firstAdmin = await storage.createAdmin({
  username: "first-admin",
  password: await hashPassword("first-admin-password"),
  name: "First Admin",
  registeredAt: "2026.08.23",
  registeredTime: "12:00",
});
assert.equal(await storage.getActiveAdminCount(), 1);
const firstAdminVersion = firstAdmin.authVersion;
await storage.updateUserPassword(firstAdmin.id, await hashPassword("rotated-admin-password"));
assert.equal((await storage.getUser(firstAdmin.id))?.authVersion, firstAdminVersion + 1);
assert.equal(await storage.deleteAdminSafely(firstAdmin.id, false), "last_admin");

const secondAdmin = await storage.createAdmin({
  username: "second-admin",
  password: await hashPassword("second-admin-password"),
  name: "Second Admin",
  registeredAt: "2026.08.23",
  registeredTime: "12:01",
});
assert.equal(await storage.deleteAdminSafely(secondAdmin.id, false), "deleted");
assert.equal(await storage.getActiveAdminCount(), 1);

const recoveryStorage = new MemoryStorage();
const legacyAdmin = await recoveryStorage.createAdmin({
  username: "legacy-admin",
  password: "legacy-plaintext-password",
  name: "Legacy Admin",
  registeredAt: "2025.01.01",
  registeredTime: "09:00",
});
assert.equal(await recoveryStorage.getActiveAdminCount(), 0);
const recovered = await recoveryStorage.createFirstAdminSafely({
  username: "legacy-admin",
  password: await hashPassword("recovered-admin-password"),
  name: "Recovered Admin",
  registeredAt: "2026.08.23",
  registeredTime: "12:02",
});
assert.equal(recovered.status, "created");
if (recovered.status === "created") assert.equal(recovered.admin.id, legacyAdmin.id);
assert.equal(await recoveryStorage.getActiveAdminCount(), 1);
assert.equal((await recoveryStorage.createFirstAdminSafely({
  username: "another-admin",
  password: await hashPassword("another-admin-password"),
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

console.log("Security smoke checks passed");
