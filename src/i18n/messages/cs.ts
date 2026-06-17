import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Otevřít dokument",
    open: "Otevřít",
    searchLanguage: "Hledat zemi nebo jazyk…"
  },
  hero: {
    title: "Bezplatné online nástroje pro dokumenty",
    searchLabel: "Co hledáte?"
  },
  nav: {
    tools: "Nástroje",
    updates: "Aktualizace",
    blog: "Blog",
    myDocs: "Moje dokumenty",
    settings: "Nastavení"
  }
} as Partial<import("../types").Messages>;

const cs: import("../types").Messages = mergeMessages(en, patch);
export default cs;
