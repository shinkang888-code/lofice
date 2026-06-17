import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Dokument öffnen",
    open: "Öffnen",
    searchLanguage: "Land oder Sprache suchen…",
    footerTagline: "All-in-One-Dokumenttools im Browser ohne Installation"
  },
  hero: {
    title: "Kostenlose Online-Dokumenttools",
    subtitle: "Leistungsstarke Viewer und Editoren direkt im Browser",
    searchLabel: "Wonach suchen Sie?",
    dropHint: "Oder Dateien hier ablegen"
  },
  start: {
    title: "Direkt loslegen",
    desc: "Wählen Sie eine Aufgabe für den passenden Bildschirm.",
    more: "Mehr"
  },
  popular: {
    title: "Beliebte Tools",
    desc: "Top-Auswahl unserer Nutzer"
  },
  nav: {
    tools: "Tools",
    updates: "Updates",
    blog: "Blog",
    myDocs: "Meine Dokumente",
    settings: "Einstellungen"
  }
} as Partial<import("../types").Messages>;

const de: import("../types").Messages = mergeMessages(en, patch);
export default de;
