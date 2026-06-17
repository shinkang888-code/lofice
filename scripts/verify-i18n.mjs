#!/usr/bin/env node
/** i18n 검증 — 로케일 수·메시지 로더·필수 키 */
import { LOCALE_DEFINITIONS } from "../src/i18n/locales.ts";
import ko from "../src/i18n/messages/ko.ts";
import en from "../src/i18n/messages/en.ts";

const required = [
  "common.openDocument",
  "hero.title",
  "nav.tools",
  "tools.pdfViewer.name",
];

function get(obj, path) {
  return path.split(".").reduce((o, k) => (o && typeof o === "object" ? o[k] : undefined), obj);
}

let ok = true;
for (const key of required) {
  if (!get(ko, key) || !get(en, key)) {
    console.error("MISSING", key);
    ok = false;
  }
}

console.log("Locales:", LOCALE_DEFINITIONS.length);
console.log("KO hero:", get(ko, "hero.title"));
console.log("EN hero:", get(en, "hero.title"));

if (!ok) process.exit(1);
console.log("i18n verify OK");
