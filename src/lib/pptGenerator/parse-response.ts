/** GPT 슬라이드 응답 파서 — text_pp.parse_response 이식 */

export type GeneratorSlideContent = {
  title: string;
  content: string;
  keyword: string;
};

export function parseGptSlideResponse(response: string): GeneratorSlideContent[] {
  const slides = response.split("\n\n").map((s) => s.trim()).filter(Boolean);
  const out: GeneratorSlideContent[] = [];
  for (const slide of slides) {
    const lines = slide.split("\n").filter((ln) => ln.trim());
    if (!lines.length) continue;
    const titleLine = lines[0]!;
    const title = titleLine.includes(": ")
      ? titleLine.split(": ").slice(1).join(": ")
      : titleLine;
    let keyword = "";
    const bodyLines: string[] = [];
    for (const ln of lines.slice(1)) {
      const t = ln.trim();
      if (t === "Content:" || t === "Contents:") continue;
      const low = t.toLowerCase();
      if (low.startsWith("keyword:") || low.startsWith("keywords:")) {
        keyword = t.split(":").slice(1).join(":").trim();
      } else {
        bodyLines.push(t);
      }
    }
    const content = bodyLines.join("\n");
    const kw = keyword || title.split(/\s+/)[0]?.slice(0, 20) || "topic";
    out.push({ title, content, keyword: kw });
  }
  return out;
}

export function buildBuiltinSlides(userText: string, count: number): GeneratorSlideContent[] {
  const base = userText.trim() || "Presentation";
  return Array.from({ length: Math.max(1, count) }, (_, i) => ({
    title: `${base} — 슬라이드 ${i + 1}`,
    content: `• ${base} 관련 핵심 내용\n• lofice AI 생성`,
    keyword: base.split(/\s+/)[0]?.slice(0, 20) || "topic",
  }));
}
