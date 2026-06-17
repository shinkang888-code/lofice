import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Deschide document",
    open: "Deschide",
    searchLanguage: "Caută țară sau limbă…"
  },
  hero: {
    title: "Instrumente documente online gratuite",
    searchLabel: "Ce cauți?"
  },
  nav: {
    tools: "Instrumente",
    updates: "Actualizări",
    blog: "Blog",
    myDocs: "Documentele mele",
    settings: "Setări"
  }
} as Partial<import("../types").Messages>;

const ro: import("../types").Messages = mergeMessages(en, patch);
export default ro;
