import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Abrir documento",
    open: "Abrir",
    searchLanguage: "Pesquisar país ou idioma…"
  },
  hero: {
    title: "Ferramentas de documentos online grátis",
    searchLabel: "O que procura?",
    dropHint: "Ou arraste ficheiros aqui"
  },
  start: {
    title: "Começar agora",
    more: "Ver mais"
  },
  nav: {
    tools: "Ferramentas",
    updates: "Atualizações",
    blog: "Blog",
    myDocs: "Meus documentos",
    settings: "Definições"
  }
} as Partial<import("../types").Messages>;

const pt: import("../types").Messages = mergeMessages(en, patch);
export default pt;
