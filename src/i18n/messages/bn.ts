import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "নথি খুলুন",
    open: "খুলুন",
    searchLanguage: "দেশ বা ভাষা খুঁজুন…"
  },
  hero: {
    title: "বিনামূল্যে অনলাইন নথি সরঞ্জাম",
    searchLabel: "আপনি কী খুঁজছেন?"
  },
  nav: {
    tools: "সরঞ্জাম",
    updates: "আপডেট",
    blog: "ব্লগ",
    myDocs: "আমার নথি",
    settings: "সেটিংস"
  }
} as Partial<import("../types").Messages>;

const bn: import("../types").Messages = mergeMessages(en, patch);
export default bn;
