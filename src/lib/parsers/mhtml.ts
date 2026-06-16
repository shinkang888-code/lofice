/** MHT / MHTML (Word 웹 아카이브) 파싱 */
export function parseMhtml(buffer: ArrayBuffer): { html: string; title?: string } {
  const text = new TextDecoder("utf-8", { fatal: false }).decode(buffer);

  const boundaryMatch = text.match(/boundary="?([^"\r\n;]+)"?/i);
  if (boundaryMatch) {
    const boundary = boundaryMatch[1];
    const parts = text.split(`--${boundary}`);
    for (const part of parts) {
      if (!/content-type:\s*text\/html/i.test(part)) continue;
      const bodyStart = part.search(/\r\n\r\n|\n\n/);
      if (bodyStart < 0) continue;
      const html = part.slice(bodyStart).replace(/^\s+/, "").replace(/--\s*$/, "").trim();
      if (html.length > 20) {
        const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
        return { html, title: title ?? undefined };
      }
    }
  }

  const htmlStart = text.search(/<html[\s>]/i);
  if (htmlStart >= 0) {
    const html = text.slice(htmlStart);
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
    return { html, title: title ?? undefined };
  }

  throw new Error("MHTML에서 HTML 본문을 찾을 수 없습니다.");
}
