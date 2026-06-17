import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Apri documento",
    open: "Apri",
    searchLanguage: "Cerca paese o lingua…"
  },
  hero: {
    title: "Strumenti documentali online gratuiti",
    searchLabel: "Cosa stai cercando?",
    dropHint: "O trascina i file qui"
  },
  start: {
    title: "Inizia subito",
    more: "Altro"
  },
  nav: {
    tools: "Strumenti",
    updates: "Aggiornamenti",
    blog: "Blog",
    myDocs: "I miei documenti",
    settings: "Impostazioni"
  }
} as Partial<import("../types").Messages>;

const it: import("../types").Messages = mergeMessages(en, patch);
export default it;
