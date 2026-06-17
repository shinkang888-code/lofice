import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Открыть документ",
    open: "Открыть",
    searchLanguage: "Поиск страны или языка…"
  },
  hero: {
    title: "Бесплатные онлайн-инструменты для документов",
    searchLabel: "Что вы ищете?",
    dropHint: "Или перетащите файлы сюда"
  },
  start: {
    title: "Начать работу",
    more: "Ещё"
  },
  nav: {
    tools: "Инструменты",
    updates: "Обновления",
    blog: "Блог",
    myDocs: "Мои документы",
    settings: "Настройки"
  }
} as Partial<import("../types").Messages>;

const ru: import("../types").Messages = mergeMessages(en, patch);
export default ru;
