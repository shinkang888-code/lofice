import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "दस्तावेज़ खोलें",
    open: "खोलें",
    searchLanguage: "देश या भाषा खोजें…"
  },
  hero: {
    title: "मुफ़्त ऑनलाइन दस्तावेज़ टूल",
    searchLabel: "आप क्या ढूँढ रहे हैं?",
    dropHint: "या फ़ाइलें यहाँ खींचें"
  },
  start: {
    title: "तुरंत शुरू करें",
    more: "और देखें"
  },
  nav: {
    tools: "टूल",
    updates: "अपडेट",
    blog: "ब्लॉग",
    myDocs: "मेरे दस्तावेज़",
    settings: "सेटिंग"
  }
} as Partial<import("../types").Messages>;

const hi: import("../types").Messages = mergeMessages(en, patch);
export default hi;
