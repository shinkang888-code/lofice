import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Åpne dokument",
    open: "Åpne",
    searchLanguage: "Søk land eller språk…"
  },
  hero: {
    title: "Gratis dokumentverktøy på nett",
    searchLabel: "Hva leter du etter?"
  },
  nav: {
    tools: "Verktøy",
    updates: "Oppdateringer",
    blog: "Blogg",
    myDocs: "Mine dokumenter",
    settings: "Innstillinger"
  }
} as Partial<import("../types").Messages>;

const no: import("../types").Messages = mergeMessages(en, patch);
export default no;
