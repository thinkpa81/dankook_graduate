import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { randomBytes } from "crypto";
import { initializeStorage } from "./storage";
import { pool } from "./db";
import {
  noStore,
  isPasswordHash,
  requestIdMiddleware,
  requireSameOrigin,
  type AppRole,
} from "./security";

const app = express();
const httpServer = createServer(app);

const sessionSecret = process.env.SESSION_SECRET ?? (
  process.env.NODE_ENV === "production"
    ? (() => { throw new Error("SESSION_SECRET is required in production"); })()
    : randomBytes(32).toString("hex")
);
if (process.env.NODE_ENV === "production" && sessionSecret.length < 32) {
  throw new Error("SESSION_SECRET must contain at least 32 characters in production");
}

const hasAdminUsername = Boolean(process.env.ADMIN_USERNAME?.trim());
const hasAdminPasswordHash = Boolean(process.env.ADMIN_PASSWORD_HASH?.trim());
if (hasAdminUsername !== hasAdminPasswordHash) {
  throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD_HASH must be configured together");
}
if (hasAdminPasswordHash && !isPasswordHash(process.env.ADMIN_PASSWORD_HASH!.trim())) {
  throw new Error("ADMIN_PASSWORD_HASH must use the supported scrypt format");
}
if (process.env.NODE_ENV === "production" && !hasAdminUsername) {
  console.warn("Administrative login is disabled until secure administrator variables are configured");
}

declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      name: string;
      role: AppRole;
    };
    createdAt?: number;
  }
}

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.disable("x-powered-by");
app.use(requestIdMiddleware);
app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: false, limit: "64kb" }));

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), geolocation=(), microphone=(), payment=(), usb=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");

  const contentSecurityPolicy = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self'",
    ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
  res.setHeader("Content-Security-Policy", contentSecurityPolicy);

  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

const PostgresSessionStore = connectPgSimple(session);

app.use(session({
  name: "dku.sid",
  cookie: {
    maxAge: 30 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  },
  store: new PostgresSessionStore({
    pool,
    tableName: "user_sessions",
    createTableIfMissing: true,
    pruneSessionInterval: 15 * 60,
    errorLog: () => console.error("Persistent session store error"),
  }),
  resave: false,
  saveUninitialized: false,
  rolling: true,
  unset: "destroy",
  secret: sessionSecret,
}));

app.use((req, res, next) => {
  const absoluteSessionLifetime = 8 * 60 * 60 * 1000;
  if (!req.session.user) return next();

  if (!req.session.createdAt || Date.now() - req.session.createdAt > absoluteSessionLifetime) {
    return req.session.destroy(() => {
      res.clearCookie("dku.sid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      next();
    });
  }

  next();
});

app.use("/api/users", noStore);
app.use("/api/talents", noStore);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      log(JSON.stringify({
        requestId: req.requestId,
        method: req.method,
        path,
        status: res.statusCode,
        durationMs: duration,
        actorId: req.session?.user?.id ?? null,
        actorRole: req.session?.user?.role ?? null,
      }));
    }
  });

  next();
});

app.use("/api", requireSameOrigin);

(async () => {
  // Initialize storage (database or memory fallback)
  try {
    await initializeStorage();
  } catch (error) {
    console.error("CRITICAL: Failed to initialize storage", error instanceof Error ? error.name : "UnknownError");
    process.exit(1); // 서버 종료
  }

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const isClientError = status >= 400 && status < 500;
    console.error(JSON.stringify({
      type: "request_error",
      requestId: _req.requestId,
      status,
      error: err instanceof Error ? err.name : "UnknownError",
    }));
    if (!res.headersSent) {
      res.status(status).json({
        error: isClientError ? "요청을 처리할 수 없습니다" : "서버 오류가 발생했습니다",
        code: isClientError ? "INVALID_REQUEST" : "INTERNAL_ERROR",
        requestId: _req.requestId,
      });
    } else {
      _next(err);
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
