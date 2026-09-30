import LinkifyIt from "linkify-it";

const linkify = new LinkifyIt({ fuzzyEmail: false, fuzzyIP: false })
  .add("ftp:", null)
  .add("mailto:", null);

export type TextLinkPart = { text: string; href?: string };

export function splitTextLinks(text: string): TextLinkPart[] {
  const parts: TextLinkPart[] = [];
  let cursor = 0;

  for (const match of linkify.match(text) ?? []) {
    const href = match.schema === ""
      ? `https://${match.raw}`
      : match.schema === "//"
        ? `https:${match.raw}`
        : match.url;

    try {
      const url = new URL(href);
      if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) continue;
    } catch {
      continue;
    }

    if (match.index > cursor) parts.push({ text: text.slice(cursor, match.index) });
    parts.push({ text: match.raw, href });
    cursor = match.lastIndex;
  }

  if (cursor < text.length) parts.push({ text: text.slice(cursor) });
  return parts;
}
