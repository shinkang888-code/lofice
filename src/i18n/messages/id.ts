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
    title: "Alat dokumen online gratis",
    searchLabel: "Apa yang Anda cari?",
    dropHint: "Atau seret file ke sini"
  },
  start: {
    title: "Mulai sekarang",
    more: "Lihat lainnya"
  },
  nav: {
    tools: "Alat",
    updates: "Pembaruan",
    blog: "Blog",
    myDocs: "Dokumen saya",
    settings: "Pengaturan"
  }
} as Partial<import("../types").Messages>;

const id: import("../types").Messages = mergeMessages(en, patch);
export default id;
