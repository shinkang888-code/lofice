import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "دستاویز کھولیں",
    open: "کھولیں",
    searchLanguage: "ملک یا زبان تلاش کریں…"
  },
  hero: {
    title: "مفت آن لائن دستاویز ٹولز",
    searchLabel: "آپ کیا ڈھونڈ رہے ہیں؟"
  },
  nav: {
    tools: "ٹولز",
    updates: "اپڈیٹس",
    blog: "بلاگ",
    myDocs: "میری دستاویزات",
    settings: "ترتیبات"
  }
} as Partial<import("../types").Messages>;

const ur: import("../types").Messages = mergeMessages(en, patch);
export default ur;
