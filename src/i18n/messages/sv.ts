import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Öppna dokument",
    open: "Öppna",
    searchLanguage: "Sök land eller språk…"
  },
  hero: {
    title: "Gratis dokumentverktyg online",
    searchLabel: "Vad letar du efter?"
  },
  nav: {
    tools: "Verktyg",
    updates: "Uppdateringar",
    blog: "Blogg",
    myDocs: "Mina dokument",
    settings: "Inställningar"
  }
} as Partial<import("../types").Messages>;

const sv: import("../types").Messages = mergeMessages(en, patch);
export default sv;
