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
assert.doesNotMatch(robots, /Disallow:/);
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
assert.equal((noticeHtml.match(/<main id="seo-fallback"/g) || []).length, 1);
assert.match(noticeHtml, /<h1 id="seo-fallback-title">.+<\/h1>/);
assert.match(noticeHtml, /<a href="\/about">학과 소개<\/a>/);
assert.doesNotMatch(noticeHtml, /seo-fallback-slot/);
assert.doesNotMatch(noticeHtml, /onrender\.com/);

const missingPage = await resolveSeoPage("/not-a-real-page", storage);
const missingHtml = renderSeoHtml(indexTemplate, missingPage);
assert.equal(missingPage.status, 404);
assert.match(missingHtml, /content="noindex,nofollow"/);
assert.match(missingHtml, /<h1 id="seo-fallback-title">페이지를 찾을 수 없습니다<\/h1>/);

const originalNaverVerification = process.env.NAVER_SITE_VERIFICATION;
const originalGoogleVerification = process.env.GOOGLE_SITE_VERIFICATION;
try {
  process.env.NAVER_SITE_VERIFICATION = "naver_test_token_1234567890";
  process.env.GOOGLE_SITE_VERIFICATION = "google_test_token_1234567890";
  const templateWithStaleVerification = indexTemplate.replace(
    "</head>",
    [
      '    <meta name="naver-site-verification" content="stale_naver_token" />',
      '    <meta content="stale_google_token_one" name="google-site-verification">',
      "    <meta name='google-site-verification' content='stale_google_token_two'>",
      "  </head>",
    ].join("\n"),
  );
  const verifiedHtml = renderSeoHtml(templateWithStaleVerification, noticePage);
  assert.equal((verifiedHtml.match(/name=["']naver-site-verification["']/g) || []).length, 1);
  assert.equal((verifiedHtml.match(/name=["']google-site-verification["']/g) || []).length, 1);
  assert.match(
    verifiedHtml,
    /<meta name="naver-site-verification" content="naver_test_token_1234567890" \/>/,
  );
  assert.match(
    verifiedHtml,
    /<meta name="google-site-verification" content="google_test_token_1234567890" \/>/,
  );

  process.env.NAVER_SITE_VERIFICATION = "invalid naver token";
  process.env.GOOGLE_SITE_VERIFICATION = "invalid google token";
  const invalidVerificationHtml = renderSeoHtml(templateWithStaleVerification, noticePage);
  assert.doesNotMatch(invalidVerificationHtml, /name=["']naver-site-verification["']/);
  assert.doesNotMatch(invalidVerificationHtml, /name=["']google-site-verification["']/);
} finally {
  if (originalNaverVerification === undefined) delete process.env.NAVER_SITE_VERIFICATION;
  else process.env.NAVER_SITE_VERIFICATION = originalNaverVerification;
  if (originalGoogleVerification === undefined) delete process.env.GOOGLE_SITE_VERIFICATION;
  else process.env.GOOGLE_SITE_VERIFICATION = originalGoogleVerification;
}

const escapedHtml = renderSeoHtml(indexTemplate, {
  canonicalPath: "/notices/99",
  title: "<script>alert(1)</script>",
  heading: '<img src=x onerror="alert(1)">',
  description: "본문 & <script>alert(2)</script>",
  indexable: true,
  status: 200,
});
assert.doesNotMatch(escapedHtml, /<script>alert\([12]\)<\/script>/);
assert.doesNotMatch(escapedHtml, /<img src=x onerror=/);
assert.match(escapedHtml, /&lt;script&gt;alert\(2\)&lt;\/script&gt;/);

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
