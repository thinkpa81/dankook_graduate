import assert from "node:assert/strict";
import {
  hashPassword,
  isPasswordHash,
  isSafeHttpUrl,
  resolveSessionSecret,
  verifyPassword,
} from "../server/security";

const password = "correct-horse-battery-staple";
const hash = await hashPassword(password);

assert.equal(isPasswordHash(hash), true);
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

console.log("Security smoke checks passed");
