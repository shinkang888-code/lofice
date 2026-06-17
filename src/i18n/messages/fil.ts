import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Buksan ang dokumento",
    open: "Buksan",
    searchLanguage: "Maghanap ng bansa o wika…"
  },
  hero: {
    title: "Libreng online na tool sa dokumento",
    searchLabel: "Ano ang hinahanap mo?"
  },
  nav: {
    tools: "Mga tool",
    updates: "Mga update",
    blog: "Blog",
    myDocs: "Aking mga dokumento",
    settings: "Mga setting"
  }
} as Partial<import("../types").Messages>;

const fil: import("../types").Messages = mergeMessages(en, patch);
export default fil;
