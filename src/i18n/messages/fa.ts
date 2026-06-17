import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "باز کردن سند",
    open: "باز کردن",
    searchLanguage: "جستجوی کشور یا زبان…"
  },
  hero: {
    title: "ابزارهای رایگان اسناد آنلاین",
    searchLabel: "به دنبال چه هستید؟"
  },
  nav: {
    tools: "ابزارها",
    updates: "به‌روزرسانی‌ها",
    blog: "وبلاگ",
    myDocs: "اسناد من",
    settings: "تنظیمات"
  }
} as Partial<import("../types").Messages>;

const fa: import("../types").Messages = mergeMessages(en, patch);
export default fa;
