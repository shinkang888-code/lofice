import type { Messages } from "../types";

type Loader = () => Promise<{ default: Messages }>;

/** 지원 메시지 팩 동적 로더 */
export const MESSAGE_LOADERS: Record<string, Loader> = {
  ko: () => import("./ko"),
  en: () => import("./en"),
  ja: () => import("./ja"),
  "zh-CN": () => import("./zh-CN"),
  "zh-TW": () => import("./zh-TW"),
  es: () => import("./es"),
  fr: () => import("./fr"),
  de: () => import("./de"),
  pt: () => import("./pt"),
  ru: () => import("./ru"),
  ar: () => import("./ar"),
  hi: () => import("./hi"),
  vi: () => import("./vi"),
  th: () => import("./th"),
  id: () => import("./id"),
  it: () => import("./it"),
  tr: () => import("./tr"),
  nl: () => import("./nl"),
  pl: () => import("./pl"),
  uk: () => import("./uk"),
  sv: () => import("./sv"),
  da: () => import("./da"),
  fi: () => import("./fi"),
  no: () => import("./no"),
  cs: () => import("./cs"),
  ro: () => import("./ro"),
  hu: () => import("./hu"),
  el: () => import("./el"),
  he: () => import("./he"),
  ms: () => import("./ms"),
  bn: () => import("./bn"),
  fa: () => import("./fa"),
  ur: () => import("./ur"),
  sw: () => import("./sw"),
  fil: () => import("./fil"),
};

export async function loadMessages(messageLocale: string): Promise<Messages> {
  const loader = MESSAGE_LOADERS[messageLocale] ?? MESSAGE_LOADERS.en;
  const mod = await loader!();
  return mod.default;
}
