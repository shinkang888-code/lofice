/**
 * Typed CustomEvent bus — Conversion Guide gameStateChange 패턴
 */
import type { PptGenerationSource } from "@/lib/reactTypes/constants";

export type LoficeVoidEventDetail = Record<string, never>;

export type LoficeEventMap = {
  "lofice:openFile": { name: string; data: string };
  "lofice:documentOpened": { fileName: string; mimeType?: string; size?: number };
  "lofice:pptGenerated": { fileName: string; source: PptGenerationSource | string };
  "lofice:themeChange": { theme: "light" | "dark" | "system" };
  /** 앱 상태 초기화 (guide restart 이벤트) */
  "lofice:restart": LoficeVoidEventDetail;
};

export type LoficeEventName = keyof LoficeEventMap;

export function dispatchLoficeEvent<K extends LoficeEventName>(
  type: K,
  detail: LoficeEventMap[K],
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(type, { detail }));
}

export function subscribeLoficeEvent<K extends LoficeEventName>(
  type: K,
  handler: (detail: LoficeEventMap[K]) => void,
): () => void {
  const listener = (e: Event) => {
    handler((e as CustomEvent<LoficeEventMap[K]>).detail);
  };
  window.addEventListener(type, listener);
  return () => window.removeEventListener(type, listener);
}
