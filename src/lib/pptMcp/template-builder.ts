/**
 * create_presentation_from_templates — 클라이언트 JSZip PPTX 생성
 */
import type { PptxSlide } from "@/lib/parsers/pptx";
import { exportSlidesToPptx } from "@/lib/ppt/pptx-export";
import { getColorScheme, type PptColorSchemeId } from "@/lib/pptMcp/color-schemes";
import { PPT_SLIDE_TEMPLATES, type TemplateSequenceItem } from "@/lib/pptMcp/templates";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function bulletsHtml(text: string, color: string): string {
  const lines = text.split(/\n|\\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return `<p style="color:${color}">—</p>`;
  return `<ul>${lines.map((l) => `<li style="margin-bottom:0.5rem;color:${color}">${escapeHtml(l.replace(/^[-•]\s*/, ""))}</li>`).join("")}</ul>`;
}

function templateToSlide(
  spec: TemplateSequenceItem,
  schemeId: PptColorSchemeId,
  index: number,
): PptxSlide {
  const scheme = getColorScheme(schemeId);
  const tpl = PPT_SLIDE_TEMPLATES.find((t) => t.id === spec.template_id);
  const c = spec.content;
  const title = c.title ?? c.quote ?? tpl?.name ?? `슬라이드 ${index + 1}`;

  let html = "";
  if (spec.template_id === "title_slide") {
    html = `<p style="font-size:1.1rem;color:${scheme.secondary}">${escapeHtml(c.subtitle ?? "")}</p>`;
    if (c.author) html += `<p style="color:${scheme.accent};margin-top:1rem">${escapeHtml(c.author)}</p>`;
  } else if (spec.template_id === "key_metrics_dashboard") {
    html = `<div style="display:flex;gap:1rem;flex-wrap:wrap">`;
    for (const k of ["metric_1_value", "metric_2_value", "metric_3_value"]) {
      if (c[k]) html += `<div style="flex:1;min-width:80px;padding:1rem;background:${scheme.gradient};color:white;border-radius:8px;text-align:center"><strong style="font-size:1.5rem">${escapeHtml(c[k]!)}</strong></div>`;
    }
    html += `</div>`;
  } else if (spec.template_id === "before_after_comparison") {
    html = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
      <div style="padding:1rem;border-left:4px solid ${scheme.primary}"><strong>Before</strong><p>${escapeHtml(c.content_left ?? "")}</p></div>
      <div style="padding:1rem;border-left:4px solid ${scheme.accent}"><strong>After</strong><p>${escapeHtml(c.content_right ?? "")}</p></div>
    </div>`;
  } else if (c.agenda_items || c.steps || c.timeline_items || c.members) {
    html = bulletsHtml(c.agenda_items ?? c.steps ?? c.timeline_items ?? c.members ?? "", scheme.text);
  } else if (c.content) {
    html = bulletsHtml(c.content, scheme.text);
  } else if (c.content_left || c.content_right) {
    html = bulletsHtml(`${c.content_left ?? ""}\n${c.content_right ?? ""}`, scheme.text);
  } else if (c.quote) {
    html = `<blockquote style="font-size:1.25rem;color:${scheme.primary};border-left:4px solid ${scheme.accent};padding-left:1rem">${escapeHtml(c.quote)}</blockquote>`;
    if (c.author) html += `<p style="color:${scheme.text}">— ${escapeHtml(c.author)}</p>`;
  } else {
    html = `<p style="color:${scheme.text}">${escapeHtml(Object.values(c).join(" · ") || tpl?.description || "")}</p>`;
  }

  return {
    index: index + 1,
    title,
    html,
    notes: c.notes,
    desc: tpl?.description,
  };
}

export function buildSlidesFromTemplateSequence(
  sequence: TemplateSequenceItem[],
  colorScheme: PptColorSchemeId = "modern_blue",
): PptxSlide[] {
  return sequence.map((spec, i) => templateToSlide(spec, colorScheme, i));
}

export async function createPresentationFromTemplates(
  sequence: TemplateSequenceItem[],
  fileName: string,
  colorScheme: PptColorSchemeId = "modern_blue",
): Promise<ArrayBuffer> {
  const slides = buildSlidesFromTemplateSequence(sequence, colorScheme);
  return exportSlidesToPptx(slides, fileName);
}
