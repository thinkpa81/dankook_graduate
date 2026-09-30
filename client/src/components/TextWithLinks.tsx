import React from "react";
import { splitTextLinks } from "@/lib/text-links";

export default function TextWithLinks({ text = "" }: { text?: string | null }) {
  return <>{splitTextLinks(text ?? "").map((part, index) => part.href ? (
    <a
      key={index}
      href={part.href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-sm font-medium text-[#2156D9] underline underline-offset-4 [overflow-wrap:anywhere] hover:text-[#1848bc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2156D9]"
    >
      {part.text}<span className="sr-only"> (새 창)</span>
    </a>
  ) : <React.Fragment key={index}>{part.text}</React.Fragment>)}</>;
}
