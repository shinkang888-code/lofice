import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Ouvrir un document",
    open: "Ouvrir",
    searchLanguage: "Rechercher un pays ou une langue…",
    footerTagline: "Suite bureautique dans le navigateur, sans installation"
  },
  hero: {
    title: "Outils documentaires en ligne gratuits",
    subtitle: "Visionneuses et éditeurs puissants dans votre navigateur",
    searchLabel: "Que recherchez-vous ?",
    dropHint: "Ou déposez des fichiers ici"
  },
  start: {
    title: "Commencer",
    desc: "Choisissez une tâche pour accéder au bon écran.",
    more: "Voir plus"
  },
  popular: {
    title: "Outils populaires",
    desc: "Les favoris de nos utilisateurs"
  },
  nav: {
    tools: "Outils",
    updates: "Mises à jour",
    blog: "Blog",
    myDocs: "Mes documents",
    settings: "Paramètres"
  }
} as Partial<import("../types").Messages>;

const fr: import("../types").Messages = mergeMessages(en, patch);
export default fr;
