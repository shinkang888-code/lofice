import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Åbn dokument",
    open: "Åbn",
    searchLanguage: "Søg land eller sprog…"
  },
  hero: {
    title: "Gratis online dokumentværktøjer",
    searchLabel: "Hvad leder du efter?"
  },
  nav: {
    tools: "Værktøjer",
    updates: "Opdateringer",
    blog: "Blog",
    myDocs: "Mine dokumenter",
    settings: "Indstillinger"
  }
} as Partial<import("../types").Messages>;

const da: import("../types").Messages = mergeMessages(en, patch);
export default da;
