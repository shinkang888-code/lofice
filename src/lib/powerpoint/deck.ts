/**
 * powerpoint Ruby gem API 이식
 * @see https://github.com/shinkang888-code/powerpoint
 *
 * add_intro / add_textual_slide / add_pictorial_slide 패턴
 */
import type { PptxSlide } from "@/lib/parsers/pptx";
import { exportSlidesToPptx } from "@/lib/ppt/pptx-export";

export type PowerpointSlideType =
  | "intro"
  | "textual"
  | "pictorial"
  | "text_picture"
  | "description_picture";

export type PowerpointSlideSpec =
  | { type: "intro"; title: string; subtitle?: string }
  | { type: "textual"; title: string; content: string[] }
  | { type: "pictorial"; title: string; imageUrl: string }
  | { type: "text_picture"; title: string; imageUrl: string; content: string[] }
  | { type: "description_picture"; title: string; imageUrl: string; content: string[] };

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function bulletsHtml(items: string[]): string {
  if (!items.length) return "<p>—</p>";
  return `<ul>${items.map((t) => `<li style="margin-bottom:0.4rem">${escapeHtml(t)}</li>`).join("")}</ul>`;
}

function specToPptxSlide(spec: PowerpointSlideSpec, index: number): PptxSlide {
  switch (spec.type) {
    case "intro":
      return {
        index: index + 1,
        title: spec.title,
        html: spec.subtitle
          ? `<p style="font-size:1.2rem;color:#666">${escapeHtml(spec.subtitle)}</p>`
          : "",
        desc: "intro",
      };
    case "textual":
      return {
        index: index + 1,
        title: spec.title,
        html: bulletsHtml(spec.content),
        desc: "textual",
      };
    case "pictorial":
      return {
        index: index + 1,
        title: spec.title,
        html: `<img src="${spec.imageUrl}" alt="" style="max-width:100%;max-height:360px;object-fit:contain" />`,
        imageUrls: [spec.imageUrl],
        desc: "pictorial",
      };
    case "text_picture":
      return {
        index: index + 1,
        title: spec.title,
        html: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">${bulletsHtml(spec.content)}<img src="${spec.imageUrl}" alt="" style="max-width:100%" /></div>`,
        imageUrls: [spec.imageUrl],
        desc: "text_picture",
      };
    case "description_picture":
      return {
        index: index + 1,
        title: spec.title,
        html: `<img src="${spec.imageUrl}" alt="" style="max-width:100%;max-height:240px" /><div style="margin-top:1rem">${bulletsHtml(spec.content)}</div>`,
        imageUrls: [spec.imageUrl],
        desc: "description_picture",
      };
    default:
      return { index: index + 1, title: "Slide", html: "" };
  }
}

/** Ruby Powerpoint::Presentation 대응 */
export class PowerpointPresentation {
  private slides: PowerpointSlideSpec[] = [];

  addIntro(title: string, subtitle?: string): this {
    const existing = this.slides.findIndex((s) => s.type === "intro");
    const spec: PowerpointSlideSpec = { type: "intro", title, subtitle };
    if (existing >= 0) this.slides[existing] = spec;
    else this.slides.unshift(spec);
    return this;
  }

  addTextualSlide(title: string, content: string[] = []): this {
    this.slides.push({ type: "textual", title, content });
    return this;
  }

  addPictorialSlide(title: string, imageUrl: string): this {
    this.slides.push({ type: "pictorial", title, imageUrl });
    return this;
  }

  addTextPictureSlide(title: string, imageUrl: string, content: string[] = []): this {
    this.slides.push({ type: "text_picture", title, imageUrl, content });
    return this;
  }

  addPictureDescriptionSlide(title: string, imageUrl: string, content: string[] = []): this {
    this.slides.push({ type: "description_picture", title, imageUrl, content });
    return this;
  }

  get slideCount(): number {
    return this.slides.length;
  }

  toPptxSlides(): PptxSlide[] {
    return this.slides.map((s, i) => specToPptxSlide(s, i));
  }

  async save(fileName: string): Promise<ArrayBuffer> {
    return exportSlidesToPptx(this.toPptxSlides(), fileName);
  }

  static fromSpecs(specs: PowerpointSlideSpec[]): PowerpointPresentation {
    const deck = new PowerpointPresentation();
    deck.slides = [...specs];
    return deck;
  }
}

export function parsePowerpointOutline(raw: unknown): PowerpointPresentation {
  if (!Array.isArray(raw)) throw new Error("AI outline은 JSON 배열이어야 합니다.");
  const deck = new PowerpointPresentation();
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const type = String(o.type ?? o.slide_type ?? "textual");
    const title = String(o.title ?? "슬라이드");
    const content = Array.isArray(o.content)
      ? o.content.map(String)
      : typeof o.content === "string"
        ? o.content.split("\n").filter(Boolean)
        : [];
    if (type === "intro") deck.addIntro(title, o.subtitle ? String(o.subtitle) : undefined);
    else if (type === "pictorial" && o.image_url) deck.addPictorialSlide(title, String(o.image_url));
    else if (type === "text_picture" && o.image_url) deck.addTextPictureSlide(title, String(o.image_url), content);
    else if (type === "description_picture" && o.image_url) deck.addPictureDescriptionSlide(title, String(o.image_url), content);
    else deck.addTextualSlide(title, content);
  }
  if (deck.slideCount === 0) throw new Error("유효한 슬라이드가 없습니다.");
  return deck;
}

/** API/AI 없이 주제만으로 기본 deck (gem 패턴) */
export function buildHeuristicDeck(topic: string, author = "lofice"): PowerpointPresentation {
  const deck = new PowerpointPresentation();
  deck.addIntro(topic, `${author} · AI 생성`);
  deck.addTextualSlide("개요", [
    `${topic}에 대한 프레젠테이션`,
    "powerpoint gem 패턴 (intro + textual slides)",
  ]);
  deck.addTextualSlide("핵심 내용 1", [
    `${topic}의 배경과 필요성`,
    "현황 분석 및 문제 정의",
  ]);
  deck.addTextualSlide("핵심 내용 2", [
    "해결 방안 및 실행 계획",
    "기대 효과와 성과 지표",
  ]);
  deck.addTextualSlide("결론", [
    "요약 및 핵심 메시지",
    "Q&A · 감사합니다",
  ]);
  return deck;
}
