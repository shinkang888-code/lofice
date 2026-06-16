/**
 * extract_slide_text / extract_presentation_text — MCP v2.1 클라이언트 이식
 */
import { parsePptx } from "@/lib/parsers/pptx";

export type SlideTextContent = {
  slide_index: number;
  slide_title: string;
  placeholders: { text: string }[];
  text_shapes: { text: string }[];
  all_text_combined: string;
  has_notes: boolean;
  notes?: string;
};

export type PresentationTextResult = {
  total_slides: number;
  slides_with_text: number;
  slides_text: SlideTextContent[];
  all_presentation_text_combined: string;
};

function stripHtml(html: string): string {
  if (typeof document === "undefined") {
    return html.replace(/<[^>]+>/g, "\n").replace(/\n+/g, "\n").trim();
  }
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent ?? "").trim();
}

export async function extractPresentationTextClient(buffer: ArrayBuffer): Promise<PresentationTextResult> {
  const { slides } = await parsePptx(buffer);
  const slides_text: SlideTextContent[] = slides.map((s, i) => {
    const body = stripHtml(s.html);
    const lines = body.split("\n").filter(Boolean);
    return {
      slide_index: i,
      slide_title: s.title,
      placeholders: lines.length ? [{ text: lines[0]! }] : [],
      text_shapes: lines.slice(1).map((text) => ({ text })),
      all_text_combined: [s.title, body, s.notes].filter(Boolean).join("\n"),
      has_notes: Boolean(s.notes),
      notes: s.notes,
    };
  });

  const withText = slides_text.filter((s) => s.all_text_combined.length > 0).length;
  const combined = slides_text
    .map((s) => `=== SLIDE ${s.slide_index + 1} ===\n${s.all_text_combined}`)
    .join("\n\n");

  return {
    total_slides: slides.length,
    slides_with_text: withText,
    slides_text,
    all_presentation_text_combined: combined,
  };
}
