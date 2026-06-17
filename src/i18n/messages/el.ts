import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Άνοιγμα εγγράφου",
    open: "Άνοιγμα",
    searchLanguage: "Αναζήτηση χώρας ή γλώσσας…"
  },
  hero: {
    title: "Δωρεάν διαδικτυακά εργαλεία εγγράφων",
    searchLabel: "Τι ψάχνετε;"
  },
  nav: {
    tools: "Εργαλεία",
    updates: "Ενημερώσεις",
    blog: "Ιστολόγιο",
    myDocs: "Τα έγγραφά μου",
    settings: "Ρυθμίσεις"
  }
} as Partial<import("../types").Messages>;

const el: import("../types").Messages = mergeMessages(en, patch);
export default el;
