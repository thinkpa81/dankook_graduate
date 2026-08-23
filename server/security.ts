import { randomBytes, randomUUID, scrypt, timingSafeEqual } from "crypto";
import type { NextFunction, Request, RequestHandler, Response } from "express";

export type AppRole = "ADMIN" | "USER";

export type SessionSecretResolution = {
  secret: string;
  source: "configured" | "generated";
  reason: "missing" | "too_short" | null;
};

declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

const SCRYPT_N = 16_384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEY_LENGTH = 64;
const PASSWORD_HASH_PREFIX = "scrypt$v1$";

export function resolveSessionSecret(
  configuredValue: string | undefined,
  isProduction: boolean,
): SessionSecretResolution {
  const configured = configuredValue?.trim();
  const isLongEnough = configured && Buffer.byteLength(configured, "utf8") >= 32;

  if (configured && (!isProduction || isLongEnough)) {
    return { secret: configured, source: "configured", reason: null };
  }

  return {
    secret: randomBytes(48).toString("base64url"),
    source: "generated",
    reason: configured ? "too_short" : "missing",
  };
}

function derivePasswordKey(
  password: string,
  salt: Buffer,
  options: { N: number; r: number; p: number },
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      SCRYPT_KEY_LENGTH,
      { ...options, maxmem: 64 * 1024 * 1024 },
      (error, derivedKey) => {
        if (error) reject(error);
        else resolve(derivedKey as Buffer);
      },
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await derivePasswordKey(password, salt, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });

  return [
    "scrypt",
    "v1",
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    salt.toString("base64url"),
    hash.toString("base64url"),
  ].join("$");
}

type ParsedPasswordHash = {
  N: number;
  r: number;
  p: number;
  salt: Buffer;
  expected: Buffer;
};

function parsePasswordHash(value: string): ParsedPasswordHash | null {
  if (!value.startsWith(PASSWORD_HASH_PREFIX)) return null;
  const parts = value.split("$");
  if (parts.length !== 7 || parts[0] !== "scrypt" || parts[1] !== "v1") return null;

  const N = Number(parts[2]);
  const r = Number(parts[3]);
  const p = Number(parts[4]);
  if (N !== SCRYPT_N || r !== SCRYPT_R || p !== SCRYPT_P) return null;
  if (!/^[A-Za-z0-9_-]+$/.test(parts[5]) || !/^[A-Za-z0-9_-]+$/.test(parts[6])) return null;

  const salt = Buffer.from(parts[5], "base64url");
  const expected = Buffer.from(parts[6], "base64url");
  if (salt.length !== 16 || expected.length !== SCRYPT_KEY_LENGTH) return null;
  if (salt.toString("base64url") !== parts[5] || expected.toString("base64url") !== parts[6]) return null;
  return { N, r, p, salt, expected };
}

export function isPasswordHash(value: string): boolean {
  return parsePasswordHash(value) !== null;
}

export async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
  const parsed = parsePasswordHash(encodedHash);
  if (!parsed) return false;

  try {
    const actual = await derivePasswordKey(password, parsed.salt, parsed);
    return timingSafeEqual(actual, parsed.expected);
  } catch {
    return false;
  }
}

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  req.requestId = randomUUID();
  res.setHeader("X-Request-Id", req.requestId);
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) {
    return res.status(401).json({ error: "로그인이 필요합니다", code: "AUTH_REQUIRED" });
  }
  next();
}

export function requireRole(...roles: AppRole[]): RequestHandler {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "로그인이 필요합니다", code: "AUTH_REQUIRED" });
    }
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).json({ error: "권한이 없습니다", code: "FORBIDDEN" });
    }
    next();
  };
}

export function noStore(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Pragma", "no-cache");
  next();
}

function normalizedOrigin(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function requireSameOrigin(req: Request, res: Response, next: NextFunction) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();

  const fetchSite = req.get("Sec-Fetch-Site");
  if (fetchSite === "cross-site") {
    return res.status(403).json({ error: "허용되지 않은 요청입니다", code: "ORIGIN_REJECTED" });
  }

  const origin = req.get("Origin");
  if (!origin && process.env.NODE_ENV !== "production") return next();
  if (!origin) {
    return res.status(403).json({ error: "요청 출처를 확인할 수 없습니다", code: "ORIGIN_REQUIRED" });
  }

  const requestOrigin = normalizedOrigin(origin);
  const host = req.get("host");
  const sameOrigin = host ? `${req.protocol}://${host}` : null;
  const configuredOrigins = [
    process.env.PUBLIC_ORIGIN,
    ...(process.env.ALLOWED_ORIGINS ?? "").split(","),
  ]
    .map(value => value?.trim())
    .filter((value): value is string => Boolean(value))
    .map(normalizedOrigin)
    .filter((value): value is string => Boolean(value));

  const allowedOrigins = new Set([sameOrigin, ...configuredOrigins].filter(Boolean));
  if (!requestOrigin || !allowedOrigins.has(requestOrigin)) {
    return res.status(403).json({ error: "허용되지 않은 요청 출처입니다", code: "ORIGIN_REJECTED" });
  }

  next();
}

type RateLimitOptions = {
  windowMs: number;
  max: number;
  message?: string;
  key?: (req: Request) => string;
};

type RateLimitEntry = { count: number; resetAt: number };

export function rateLimit({ windowMs, max, message, key }: RateLimitOptions): RequestHandler {
  const entries = new Map<string, RateLimitEntry>();

  return (req, res, next) => {
    const now = Date.now();
    const rateKey = key?.(req) ?? req.ip ?? req.socket.remoteAddress ?? "unknown";
    const current = entries.get(rateKey);
    const entry = !current || current.resetAt <= now
      ? { count: 0, resetAt: now + windowMs }
      : current;

    entry.count += 1;
    entries.set(rateKey, entry);

    const remaining = Math.max(0, max - entry.count);
    res.setHeader("RateLimit-Limit", String(max));
    res.setHeader("RateLimit-Remaining", String(remaining));
    res.setHeader("RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));

    if (entry.count > max) {
      res.setHeader("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
      return res.status(429).json({
        error: message ?? "요청이 너무 많습니다. 잠시 후 다시 시도해주세요",
        code: "RATE_LIMITED",
      });
    }

    if (entries.size > 10_000) {
      entries.forEach((value, entryKey) => {
        if (value.resetAt <= now) entries.delete(entryKey);
      });
    }

    next();
  };
}

export function auditEvent(req: Request, action: string, target?: string) {
  console.info(JSON.stringify({
    timestamp: new Date().toISOString(),
    type: "security_audit",
    requestId: req.requestId,
    actorId: req.session.user?.id ?? null,
    actorRole: req.session.user?.role ?? null,
    action,
    target: target ?? null,
  }));
}

export function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
