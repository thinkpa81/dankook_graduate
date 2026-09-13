import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { getStorage } from "./storage";
import { renderSeoHtml, resolveSeoPage } from "./seo";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  const indexPath = path.resolve(distPath, "index.html");
  const indexTemplate = fs.readFileSync(indexPath, "utf-8");

  app.get("/admissions", (_req, res) => res.redirect(308, "/admissions/guidelines"));
  app.get("/talent-pool", (_req, res) => res.redirect(308, "/admissions/guidelines"));
  app.get("/privacy", (_req, res) => res.redirect(308, "/"));
  app.get("/papers", (_req, res) => res.redirect(308, "/papers/conference"));
  app.get("/index.html", (_req, res) => res.redirect(308, "/"));
  app.get("/favicon.ico", (_req, res) => res.redirect(308, "/favicon.png?v=dku-20260819"));

  app.use((req, res, next) => {
    if (
      (req.method === "GET" || req.method === "HEAD")
      && req.path.length > 1
      && req.path.endsWith("/")
      && !req.path.startsWith("/api/")
    ) {
      const query = req.originalUrl.slice(req.path.length);
      return res.redirect(308, `${req.path.slice(0, -1)}${query}`);
    }
    next();
  });

  app.use(express.static(distPath, { index: false }));

  app.get("*", async (req, res, next) => {
    try {
      if (req.path === "/api" || req.path.startsWith("/api/")) {
        res.setHeader("X-Robots-Tag", "noindex, nofollow");
        return res.status(404).json({ error: "API 경로를 찾을 수 없습니다", code: "API_NOT_FOUND" });
      }
      const page = await resolveSeoPage(req.path, getStorage());
      if (!page.indexable) res.setHeader("X-Robots-Tag", "noindex, nofollow");
      res.status(page.status).type("html").send(renderSeoHtml(indexTemplate, page));
    } catch (error) {
      if (res.headersSent) return next(error);
      console.error("Failed to render application shell", error instanceof Error ? error.name : "UnknownError");
      res.status(500).type("text/plain").send("서버 오류가 발생했습니다");
    }
  });
}
