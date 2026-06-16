/**
 * AI → powerpoint gem deck 생성
 */
import { getPptMcpUrl, isPptMcpServerAvailable } from "@/lib/pptMcp/config";
import type { PptColorSchemeId } from "@/lib/pptMcp/color-schemes";
import {
  buildHeuristicDeck,
  parsePowerpointOutline,
  PowerpointPresentation,
} from "@/lib/powerpoint/deck";

export type AiDeckRequest = {
  topic: string;
  slide_count?: number;
  language?: string;
  author?: string;
  color_scheme?: PptColorSchemeId;
};

export type AiDeckResult = {
  deck: PowerpointPresentation;
  source: "ai" | "heuristic";
  outline?: unknown;
};

export async function generateAiPowerpointDeck(req: AiDeckRequest): Promise<AiDeckResult> {
  const base = getPptMcpUrl();
  if (base && isPptMcpServerAvailable()) {
    try {
      const res = await fetch(`${base}/ai-deck`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: req.topic,
          slide_count: req.slide_count ?? 6,
          language: req.language ?? "ko",
          author: req.author ?? "lofice",
          color_scheme: req.color_scheme ?? "modern_blue",
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { outline: unknown };
        return {
          deck: parsePowerpointOutline(data.outline),
          source: "ai",
          outline: data.outline,
        };
      }
    } catch {
      /* heuristic fallback */
    }
  }

  return {
    deck: buildHeuristicDeck(req.topic, req.author ?? "lofice"),
    source: "heuristic",
  };
}

export async function saveAiDeck(req: AiDeckRequest, fileName: string): Promise<ArrayBuffer> {
  const { deck } = await generateAiPowerpointDeck(req);
  return deck.save(fileName);
}
