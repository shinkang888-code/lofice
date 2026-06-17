import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Відкрити документ",
    open: "Відкрити",
    searchLanguage: "Пошук країни або мови…"
  },
  hero: {
    title: "Безкоштовні онлайн-інструменти для документів",
    searchLabel: "Що ви шукаєте?",
    dropHint: "Або перетягніть файли сюди"
  },
  nav: {
    tools: "Інструменти",
    updates: "Оновлення",
    blog: "Блог",
    myDocs: "Мої документи",
    settings: "Налаштування"
  }
} as Partial<import("../types").Messages>;

const uk: import("../types").Messages = mergeMessages(en, patch);
export default uk;
