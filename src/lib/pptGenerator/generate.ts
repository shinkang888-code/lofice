/**
 * PowerPoint-Generator-Python-Project 클라이언트
 * @see https://github.com/shinkang888-code/PowerPoint-Generator-Python-Project
 */
import { getPptMcpUrl, isPptMcpServerAvailable } from "@/lib/pptMcp/config";
import { PowerpointPresentation } from "@/lib/powerpoint/deck";
import { buildBuiltinSlides, type GeneratorSlideContent } from "@/lib/pptGenerator/parse-response";
import type { PptGeneratorThemeId } from "@/lib/pptGenerator/themes";

export type PptGeneratorRequest = {
  user_text: string;
  number_of_slide?: number;
  template_choice?: PptGeneratorThemeId;
  presentation_title?: string;
  presenter_name?: string;
  insert_image?: boolean;
  language?: string;
};

export type PptGeneratorResult = {
  buffer: ArrayBuffer;
  slides: GeneratorSlideContent[];
  source: "openai" | "builtin" | "heuristic";
};

function slidesToDeck(
  slides: GeneratorSlideContent[],
  title: string,
  presenter: string,
): PowerpointPresentation {
  const deck = new PowerpointPresentation();
  deck.addIntro(title, `Presented by ${presenter}`);
  for (const s of slides) {
    const bullets = s.content
      .split("\n")
      .map((ln) => ln.replace(/^[-•*]\s*/, "").trim())
      .filter(Boolean);
    deck.addTextualSlide(s.title, bullets.length ? bullets : [s.content]);
  }
  return deck;
}

export async function generatePptFromGenerator(req: PptGeneratorRequest): Promise<PptGeneratorResult> {
  const base = getPptMcpUrl();
  const payload = {
    user_text: req.user_text,
    number_of_slide: req.number_of_slide ?? 6,
    template_choice: req.template_choice ?? "classic",
    presentation_title: req.presentation_title ?? req.user_text.slice(0, 80),
    presenter_name: req.presenter_name ?? "lofice",
    insert_image: req.insert_image ?? false,
    language: req.language ?? "ko",
  };

  if (base && isPptMcpServerAvailable()) {
    try {
      const res = await fetch(`${base}/generator/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const slidesHeader = res.headers.get("X-Slides-Json");
        const slides: GeneratorSlideContent[] = slidesHeader
          ? (JSON.parse(decodeURIComponent(slidesHeader)) as GeneratorSlideContent[])
          : [];
        const source = (res.headers.get("X-Source") as PptGeneratorResult["source"]) || "openai";
        return { buffer: await res.arrayBuffer(), slides, source };
      }
    } catch {
      /* local fallback */
    }
  }

  const slides = buildBuiltinSlides(req.user_text, payload.number_of_slide);
  const deck = slidesToDeck(slides, payload.presentation_title, payload.presenter_name);
  return {
    buffer: await deck.save("generated.pptx"),
    slides,
    source: "heuristic",
  };
}
