import type { Express, NextFunction, Request, Response } from "express";
import type { IStorage } from "./storage";

export const CANONICAL_ORIGIN = "https://dankookaims.org";

const SITE_NAME = "단국대학교 대학원 데이터지식서비스공학과";
const DEFAULT_DESCRIPTION =
  "데이터 관리 및 분석 기술과 비즈니스 마인드를 기반으로 미래 인재를 양성하는 단국대학교 대학원 데이터지식서비스공학과입니다.";

type SitemapEntry = {
  path: string;
  lastModified?: Date | string | null;
};

type RssNotice = {
  id: number;
  title: string;
  content: string;
  date: string;
};

export type SeoPage = {
  canonicalPath: string;
  description: string;
  indexable: boolean;
  status: 200 | 404;
  title: string;
};

const staticPages = new Map<string, Omit<SeoPage, "canonicalPath" | "status">>([
  ["/", {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    indexable: true,
  }],
  ["/about", {
    title: `학과 소개 | ${SITE_NAME}`,
    description: "데이터사이언스·AI·머신러닝·메타버스융합 교육과 연구를 수행하는 데이터지식서비스공학과를 소개합니다.",
    indexable: true,
  }],
  ["/notices", {
    title: `공지사항 | ${SITE_NAME}`,
    description: "단국대학교 대학원 데이터지식서비스공학과의 학사 일정, 행사 및 주요 공지사항을 확인하세요.",
    indexable: true,
  }],
  ["/papers", {
    title: `논문 | ${SITE_NAME}`,
    description: "데이터지식서비스공학과의 국내외 학술대회 및 학술지 연구 성과를 확인하세요.",
    indexable: true,
  }],
  ["/papers/conference", {
    title: `학술대회 논문 | ${SITE_NAME}`,
    description: "데이터지식서비스공학과의 국내외 학술대회 발표 논문과 연구 성과를 확인하세요.",
    indexable: true,
  }],
  ["/papers/journal", {
    title: `저널 논문 | ${SITE_NAME}`,
    description: "데이터지식서비스공학과의 국내외 학술지 게재 논문과 연구 성과를 확인하세요.",
    indexable: true,
  }],
  ["/regulations", {
    title: `학과 내규 | ${SITE_NAME}`,
    description: "데이터지식서비스공학과의 학사 운영 기준과 학과 내규를 확인하세요.",
    indexable: true,
  }],
  ["/admissions/guidelines", {
    title: `입학안내·모집요강 | ${SITE_NAME}`,
    description: "단국대학교 대학원 데이터지식서비스공학과의 입학안내와 최신 모집요강을 확인하세요.",
    indexable: true,
  }],
  ["/photos", {
    title: `사진자료실 | ${SITE_NAME}`,
    description: "데이터지식서비스공학과의 교육, 연구 및 학술 활동 사진을 확인하세요.",
    indexable: true,
  }],
  ["/admin", {
    title: `관리자 로그인 | ${SITE_NAME}`,
    description: "데이터지식서비스공학과 사이트 관리자 전용 화면입니다.",
    indexable: false,
  }],
]);

const sitemapStaticPaths = [
  "/",
  "/about",
  "/notices",
  "/papers",
  "/papers/conference",
  "/papers/journal",
  "/regulations",
  "/admissions/guidelines",
  "/photos",
];

function compactText(value: string, maxLength: number): string {
  const compacted = value.replace(/\s+/g, " ").trim();
  if (compacted.length <= maxLength) return compacted;
  return `${compacted.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeHtmlAttribute(value: string): string {
  return escapeXml(value);
}

function normalizeLastModified(value?: Date | string | null): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function noticePublicationDate(value: string): Date | null {
  const match = /^(\d{4})[.-](\d{2})[.-](\d{2})$/.exec(value.trim());
  if (!match) return null;
  const date = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00+09:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function buildRobotsTxt(): string {
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "",
    `Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml`,
    "",
  ].join("\n");
}

export function buildSitemapXml(entries: SitemapEntry[]): string {
  const seen = new Set<string>();
  const urls = entries.flatMap(entry => {
    const canonicalUrl = `${CANONICAL_ORIGIN}${entry.path === "/" ? "/" : entry.path}`;
    if (seen.has(canonicalUrl)) return [];
    seen.add(canonicalUrl);
    const lastModified = normalizeLastModified(entry.lastModified);
    return [
      "  <url>",
      `    <loc>${escapeXml(canonicalUrl)}</loc>`,
      ...(lastModified ? [`    <lastmod>${escapeXml(lastModified)}</lastmod>`] : []),
      "  </url>",
    ].join("\n");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

export function buildRssXml(notices: RssNotice[]): string {
  const items = notices.slice(0, 50).map(notice => {
    const itemUrl = `${CANONICAL_ORIGIN}/notices/${notice.id}`;
    const publicationDate = noticePublicationDate(notice.date);
    return [
      "    <item>",
      `      <title>${escapeXml(notice.title)}</title>`,
      `      <link>${escapeXml(itemUrl)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(itemUrl)}</guid>`,
      ...(publicationDate ? [`      <pubDate>${publicationDate.toUTCString()}</pubDate>`] : []),
      `      <description>${escapeXml(notice.content)}</description>`,
      "    </item>",
    ].join("\n");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(`${SITE_NAME} 공지사항`)}</title>`,
    `    <link>${CANONICAL_ORIGIN}/notices</link>`,
    `    <description>${escapeXml("데이터지식서비스공학과의 최신 공지사항입니다.")}</description>`,
    "    <language>ko</language>",
    `    <atom:link href="${CANONICAL_ORIGIN}/rss.xml" rel="self" type="application/rss+xml" />`,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}

export async function resolveSeoPage(pathname: string, storage: IStorage): Promise<SeoPage> {
  const staticPage = staticPages.get(pathname);
  if (staticPage) {
    return { ...staticPage, canonicalPath: pathname, status: 200 };
  }

  const noticeMatch = /^\/notices\/([1-9]\d*)$/.exec(pathname);
  if (noticeMatch) {
    const notice = await storage.getNotice(Number(noticeMatch[1]));
    if (notice) {
      return {
        canonicalPath: pathname,
        title: `${compactText(notice.title, 70)} | 공지사항`,
        description: compactText(notice.content || `${notice.title} 공지사항입니다.`, 160),
        indexable: true,
        status: 200,
      };
    }
  }

  const photoMatch = /^\/photos\/([1-9]\d*)$/.exec(pathname);
  if (photoMatch) {
    const photo = await storage.getPhotoAlbum(Number(photoMatch[1]));
    if (photo) {
      return {
        canonicalPath: pathname,
        title: `${compactText(photo.album.title, 70)} | 사진자료실`,
        description: compactText(photo.album.content || `${photo.album.title} 사진자료입니다.`, 160),
        indexable: true,
        status: 200,
      };
    }
  }

  return {
    canonicalPath: pathname,
    title: `페이지를 찾을 수 없습니다 | ${SITE_NAME}`,
    description: "요청한 페이지를 찾을 수 없습니다.",
    indexable: false,
    status: 404,
  };
}

function replaceMetaContent(html: string, attribute: "name" | "property", key: string, value: string): string {
  const expression = new RegExp(
    `<meta\\s+${attribute}="${key}"\\s+content="[^"]*"\\s*\\/?>`,
    "i",
  );
  const tag = `<meta ${attribute}="${key}" content="${escapeHtmlAttribute(value)}" />`;
  return expression.test(html) ? html.replace(expression, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

export function renderSeoHtml(indexTemplate: string, page: SeoPage): string {
  const canonicalUrl = `${CANONICAL_ORIGIN}${page.canonicalPath === "/" ? "/" : page.canonicalPath}`;
  const robots = page.indexable ? "index,follow,max-image-preview:large" : "noindex,nofollow";
  const verification = process.env.NAVER_SITE_VERIFICATION?.trim();

  let html = indexTemplate
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeXml(page.title)}</title>`)
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${escapeHtmlAttribute(canonicalUrl)}" />`,
    );

  html = replaceMetaContent(html, "name", "description", page.description);
  html = replaceMetaContent(html, "name", "robots", robots);
  html = replaceMetaContent(html, "property", "og:title", page.title);
  html = replaceMetaContent(html, "property", "og:description", page.description);
  html = replaceMetaContent(html, "property", "og:url", canonicalUrl);
  html = replaceMetaContent(html, "property", "og:image", `${CANONICAL_ORIGIN}/opengraph.jpg`);
  html = replaceMetaContent(html, "name", "twitter:title", page.title);
  html = replaceMetaContent(html, "name", "twitter:description", page.description);
  html = replaceMetaContent(html, "name", "twitter:image", `${CANONICAL_ORIGIN}/opengraph.jpg`);

  html = html.replace(/\s*<meta\s+name="naver-site-verification"\s+content="[^"]*"\s*\/?>/gi, "");
  if (verification && /^[A-Za-z0-9_-]{10,200}$/.test(verification)) {
    html = html.replace(
      "</head>",
      `    <meta name="naver-site-verification" content="${escapeHtmlAttribute(verification)}" />\n  </head>`,
    );
  }

  return html;
}

function sendSeoFailure(next: NextFunction, error: unknown) {
  next(error instanceof Error ? error : new Error("Failed to build SEO resource"));
}

export function registerSeoRoutes(app: Express, storage: IStorage): void {
  app.get("/robots.txt", (_req: Request, res: Response) => {
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.type("text/plain; charset=utf-8").send(buildRobotsTxt());
  });

  app.get("/sitemap.xml", async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const [notices, photos] = await Promise.all([
        storage.getNotices(),
        storage.getPhotoAlbums(),
      ]);
      const entries: SitemapEntry[] = [
        ...sitemapStaticPaths.map(path => ({ path })),
        ...notices.map(notice => ({ path: `/notices/${notice.id}` })),
        ...photos.map(photo => ({
          path: `/photos/${photo.album.id}`,
          lastModified: photo.album.updatedAt,
        })),
      ];
      res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=60");
      res.type("application/xml; charset=utf-8").send(buildSitemapXml(entries));
    } catch (error) {
      sendSeoFailure(next, error);
    }
  });

  app.get("/rss.xml", async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const notices = await storage.getNotices();
      res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=60");
      res.type("application/rss+xml; charset=utf-8").send(buildRssXml(notices));
    } catch (error) {
      sendSeoFailure(next, error);
    }
  });
}
