import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Otwórz dokument",
    open: "Otwórz",
    searchLanguage: "Szukaj kraju lub języka…"
  },
  hero: {
    title: "Darmowe narzędzia dokumentów online",
    searchLabel: "Czego szukasz?",
    dropHint: "Lub upuść pliki tutaj"
  },
  nav: {
    tools: "Narzędzia",
    updates: "Aktualizacje",
    blog: "Blog",
    myDocs: "Moje dokumenty",
    settings: "Ustawienia"
  }
} as Partial<import("../types").Messages>;

const pl: import("../types").Messages = mergeMessages(en, patch);
export default pl;
