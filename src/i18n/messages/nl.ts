import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Document openen",
    open: "Openen",
    searchLanguage: "Zoek land of taal…"
  },
  hero: {
    title: "Gratis online documenttools",
    searchLabel: "Waar zoekt u naar?",
    dropHint: "Of sleep bestanden hierheen"
  },
  nav: {
    tools: "Tools",
    updates: "Updates",
    blog: "Blog",
    myDocs: "Mijn documenten",
    settings: "Instellingen"
  }
} as Partial<import("../types").Messages>;

const nl: import("../types").Messages = mergeMessages(en, patch);
export default nl;
