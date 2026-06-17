import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Belge aç",
    open: "Aç",
    searchLanguage: "Ülke veya dil ara…"
  },
  hero: {
    title: "Ücretsiz çevrimiçi belge araçları",
    searchLabel: "Ne arıyorsunuz?",
    dropHint: "Veya dosyaları buraya sürükleyin"
  },
  start: {
    title: "Hemen başla",
    more: "Daha fazla"
  },
  nav: {
    tools: "Araçlar",
    updates: "Güncellemeler",
    blog: "Blog",
    myDocs: "Belgelerim",
    settings: "Ayarlar"
  }
} as Partial<import("../types").Messages>;

const tr: import("../types").Messages = mergeMessages(en, patch);
export default tr;
