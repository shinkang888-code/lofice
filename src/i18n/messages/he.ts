import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "פתח מסמך",
    open: "פתח",
    searchLanguage: "חפש מדינה או שפה…"
  },
  hero: {
    title: "כלי מסמכים מקוונים בחינם",
    searchLabel: "מה אתה מחפש?"
  },
  nav: {
    tools: "כלים",
    updates: "עדכונים",
    blog: "בלוג",
    myDocs: "המסמכים שלי",
    settings: "הגדרות"
  }
} as Partial<import("../types").Messages>;

const he: import("../types").Messages = mergeMessages(en, patch);
export default he;
