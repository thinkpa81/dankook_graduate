import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import TextWithLinks from "../client/src/components/TextWithLinks";
import { splitTextLinks } from "../client/src/lib/text-links";

const cases: [string, string[]][] = [
  ["https://www.nature.com/nathumbehav/\n저널 소개", ["https://www.nature.com/nathumbehav/"]],
  ["안내: www.example.com, dankook.ac.kr/grad.", ["https://www.example.com", "https://dankook.ac.kr/grad"]],
  ["(https://example.com/paper_(2026)).", ["https://example.com/paper_(2026)"]],
  ["https://example.com/문서?이름=한글&x=2#절", ["https://example.com/문서?이름=한글&x=2#절"]],
  ["홈페이지:https://example.com\nhttp://example.org\n//example.net", ["https://example.com", "http://example.org", "https://example.net"]],
  ["javascript:alert(1) data:text/html,<script>alert(1)</script> ftp://example.org", []],
  ["담당자 person@example.com, 버전 1.2.3, 날짜 2026.09.30", []],
  ["https://user:password@example.com 이후 https://safe.example.org", ["https://safe.example.org"]],
  ["줄바꿈\n\n  들여쓰기와 일반 내용", []],
  ["", []],
];

for (const [input, expected] of cases) {
  const parts = splitTextLinks(input);
  assert.deepEqual(parts.flatMap(part => part.href ? [part.href] : []), expected, input);
  assert.equal(parts.map(part => part.text).join(""), input, "Original text and whitespace must be preserved");
}

const html = renderToStaticMarkup(createElement(TextWithLinks, {
  text: '<img src=x onerror="alert(1)"> https://example.com/?a=1&b=2',
}));
assert.ok(!html.includes("<img"), "User HTML must remain escaped text");
assert.ok(html.includes("&lt;img"));
assert.ok(html.includes('href="https://example.com/?a=1&amp;b=2"'));
assert.ok(html.includes('target="_blank"'));
assert.ok(html.includes('rel="noopener noreferrer"'));
assert.ok(html.includes("(새 창)"), "Assistive technology must announce new-tab links");
assert.equal(renderToStaticMarkup(createElement(TextWithLinks, { text: null })), "");

console.log(`Content smoke checks passed (${cases.length} URL cases and safe React rendering).`);
