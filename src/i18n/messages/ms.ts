import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Buka dokumen",
    open: "Buka",
    searchLanguage: "Cari negara atau bahasa…"
  },
  hero: {
    title: "Alat dokumen dalam talian percuma",
    searchLabel: "Apa yang anda cari?"
  },
  nav: {
    tools: "Alat",
    updates: "Kemas kini",
    blog: "Blog",
    myDocs: "Dokumen saya",
    settings: "Tetapan"
  }
} as Partial<import("../types").Messages>;

const ms: import("../types").Messages = mergeMessages(en, patch);
export default ms;
