import assert from "node:assert/strict";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import express from "express";
import {
  buildRobotsTxt,
  buildRssXml,
  buildSitemapXml,
  CANONICAL_ORIGIN,
  registerSeoRoutes,
  renderSeoHtml,
  resolveSeoPage,
} from "../server/seo";
import { MemoryStorage } from "../server/storage";

const robots = buildRobotsTxt();
assert.match(robots, /^User-agent: \*/m);
assert.match(robots, /Disallow: \/admin/);
assert.equal(CANONICAL_ORIGIN, "https://dankookaims.org");
assert.match(robots, /Sitemap: https:\/\/dankookaims\.org\/sitemap\.xml/);

const sitemap = buildSitemapXml([
  { path: "/" },
  { path: "/notices/1" },
  { path: "/notices/1" },
  { path: "/photos/2", lastModified: "2026-09-13T00:00:00.000Z" },
]);
assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
assert.equal((sitemap.match(/<loc>/g) || []).length, 3);
assert.doesNotMatch(sitemap, /onrender\.com/);
assert.match(sitemap, /<lastmod>2026-09-13T00:00:00\.000Z<\/lastmod>/);

const rss = buildRssXml([
  {
    id: 7,
    title: "공지 <제목> & 확인",
    content: "본문 & 세부내용",
    date: "2026.09.13",
  },
]);
assert.match(rss, /<rss version="2\.0"/);
assert.match(rss, /공지 &lt;제목&gt; &amp; 확인/);
assert.match(rss, /https:\/\/dankookaims\.org\/notices\/7/);
assert.doesNotMatch(rss, /onrender\.com/);

const storage = new MemoryStorage();
const indexTemplate = await readFile(new URL("../client/index.html", import.meta.url), "utf8");
const noticePage = await resolveSeoPage("/notices/1", storage);
const noticeHtml = renderSeoHtml(indexTemplate, noticePage);
assert.equal(noticePage.status, 200);
assert.match(noticeHtml, /<link rel="canonical" href="https:\/\/dankookaims\.org\/notices\/1" \/>/);
assert.doesNotMatch(noticeHtml, /onrender\.com/);

const missingPage = await resolveSeoPage("/not-a-real-page", storage);
const missingHtml = renderSeoHtml(indexTemplate, missingPage);
assert.equal(missingPage.status, 404);
assert.match(missingHtml, /content="noindex,nofollow"/);

const app = express();
registerSeoRoutes(app, storage);
const server = app.listen(0, "127.0.0.1");
await once(server, "listening");
const address = server.address();
assert.ok(address && typeof address === "object");
const testOrigin = `http://127.0.0.1:${address.port}`;
try {
  const [robotsResponse, sitemapResponse, rssResponse] = await Promise.all([
    fetch(`${testOrigin}/robots.txt`),
    fetch(`${testOrigin}/sitemap.xml`),
    fetch(`${testOrigin}/rss.xml`),
  ]);
  assert.match(robotsResponse.headers.get("content-type") || "", /^text\/plain/);
  assert.match(sitemapResponse.headers.get("content-type") || "", /^application\/xml/);
  assert.match(rssResponse.headers.get("content-type") || "", /^application\/rss\+xml/);
  assert.match(await sitemapResponse.text(), /https:\/\/dankookaims\.org\/notices\/1/);
  assert.match(await rssResponse.text(), /https:\/\/dankookaims\.org\/notices\/1/);
} finally {
  server.close();
  await once(server, "close");
}

console.log("SEO smoke tests passed");
