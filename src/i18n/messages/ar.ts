import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "فتح مستند",
    open: "فتح",
    searchLanguage: "ابحث عن بلد أو لغة…"
  },
  hero: {
    title: "أدوات مستندات مجانية على الإنترنت",
    searchLabel: "ماذا تبحث عنه؟",
    dropHint: "أو اسحب الملفات هنا"
  },
  start: {
    title: "ابدأ الآن",
    more: "المزيد"
  },
  nav: {
    tools: "الأدوات",
    updates: "التحديثات",
    blog: "المدونة",
    myDocs: "مستنداتي",
    settings: "الإعدادات"
  }
} as Partial<import("../types").Messages>;

const ar: import("../types").Messages = mergeMessages(en, patch);
export default ar;
