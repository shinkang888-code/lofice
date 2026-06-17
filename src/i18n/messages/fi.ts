import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Avaa asiakirja",
    open: "Avaa",
    searchLanguage: "Etsi maata tai kieltä…"
  },
  hero: {
    title: "Ilmaiset verkkodokumenttityökalut",
    searchLabel: "Mitä etsit?"
  },
  nav: {
    tools: "Työkalut",
    updates: "Päivitykset",
    blog: "Blogi",
    myDocs: "Omat asiakirjat",
    settings: "Asetukset"
  }
} as Partial<import("../types").Messages>;

const fi: import("../types").Messages = mergeMessages(en, patch);
export default fi;
