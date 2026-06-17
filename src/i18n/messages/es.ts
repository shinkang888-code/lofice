import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Abrir documento",
    open: "Abrir",
    opening: "Abriendo…",
    searchLanguage: "Buscar país o idioma…",
    footerTagline: "Herramientas documentales en el navegador sin instalar"
  },
  hero: {
    title: "Herramientas de documentos en línea gratis",
    subtitle: "Visores y editores potentes en el navegador, sin instalación",
    searchLabel: "¿Qué buscas?",
    searchPlaceholder: "Buscar por herramienta, función o etiqueta",
    dropHint: "O arrastra archivos aquí"
  },
  start: {
    title: "Empieza ya",
    desc: "Elige una tarea y ve a la pantalla adecuada.",
    more: "Ver más"
  },
  popular: {
    title: "Herramientas más populares",
    desc: "Favoritas de nuestros usuarios"
  },
  nav: {
    tools: "Herramientas",
    updates: "Actualizaciones",
    blog: "Blog",
    myDocs: "Mis documentos",
    settings: "Ajustes",
    updatesFooter: "Notas de versión"
  },
  updates: {
    title: "Notas de versión"
  },
  blog: {
    title: "Blog",
    desc: "Guías y consejos de lofice"
  }
} as Partial<import("../types").Messages>;

const es: import("../types").Messages = mergeMessages(en, patch);
export default es;
