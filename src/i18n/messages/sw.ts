import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Fungua hati",
    open: "Fungua",
    searchLanguage: "Tafuta nchi au lugha…"
  },
  hero: {
    title: "Zana za hati mtandaoni bila malipo",
    searchLabel: "Unatafuta nini?"
  },
  nav: {
    tools: "Zana",
    updates: "Sasisho",
    blog: "Blogu",
    myDocs: "Hati zangu",
    settings: "Mipangilio"
  }
} as Partial<import("../types").Messages>;

const sw: import("../types").Messages = mergeMessages(en, patch);
export default sw;
