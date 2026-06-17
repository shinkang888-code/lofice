import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Dokumentum megnyitása",
    open: "Megnyitás",
    searchLanguage: "Ország vagy nyelv keresése…"
  },
  hero: {
    title: "Ingyenes online dokumentumeszközök",
    searchLabel: "Mit keres?"
  },
  nav: {
    tools: "Eszközök",
    updates: "Frissítések",
    blog: "Blog",
    myDocs: "Dokumentumaim",
    settings: "Beállítások"
  }
} as Partial<import("../types").Messages>;

const hu: import("../types").Messages = mergeMessages(en, patch);
export default hu;
