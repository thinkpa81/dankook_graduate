import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { getStorage } from "./storage";
import { CANONICAL_ORIGIN, renderSeoHtml, resolveSeoPage } from "./seo";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  const indexPath = path.resolve(distPath, "index.html");
  const indexTemplate = fs.readFileSync(indexPath, "utf-8");

  app.use((req, res, next) => {
    if (
      process.env.NODE_ENV === "production"
      && req.hostname.toLowerCase() === "dankook-graduate.onrender.com"
    ) {
      return res.redirect(308, `${CANONICAL_ORIGIN}${req.originalUrl}`);
    }
    next();
  });

  app.get("/admissions", (_req, res) => res.redirect(308, "/admissions/guidelines"));
  app.get("/talent-pool", (_req, res) => res.redirect(308, "/admissions/guidelines"));
  app.get("/privacy", (_req, res) => res.redirect(308, "/"));
  app.get("/favicon.ico", (_req, res) => res.redirect(308, "/favicon.png?v=dku-20260819"));

  app.use(express.static(distPath, { index: false }));

  app.get("*", async (req, res, next) => {
    try {
      const page = await resolveSeoPage(req.path, getStorage());
      if (!page.indexable) res.setHeader("X-Robots-Tag", "noindex, nofollow");
      res.status(page.status).type("html").send(renderSeoHtml(indexTemplate, page));
    } catch (error) {
      next(error);
    }
  });
}
