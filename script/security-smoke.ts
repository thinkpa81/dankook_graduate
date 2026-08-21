import assert from "node:assert/strict";
import { hashPassword, isPasswordHash, isSafeHttpUrl, verifyPassword } from "../server/security";

const password = "correct-horse-battery-staple";
const hash = await hashPassword(password);

assert.equal(isPasswordHash(hash), true);
assert.equal(hash.includes(password), false);
assert.equal(await verifyPassword(password, hash), true);
assert.equal(await verifyPassword("wrong-password", hash), false);
assert.equal(isSafeHttpUrl("https://example.edu/paper"), true);
assert.equal(isSafeHttpUrl("javascript:alert(1)"), false);

console.log("Security smoke checks passed");
