/**
 * Phase 1 — DVC-lite 로컬 검증 (hwpx-skill validate/dvc와 동일 규칙)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const JSZip = require("jszip");
const { XMLParser } = require("fast-xml-parser");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hwpxPath = path.join(__dirname, "../test-fixtures/sample.hwpx");

if (!fs.existsSync(hwpxPath)) {
  console.error("sample.hwpx missing — run: node scripts/create-test-fixtures.mjs");
  process.exit(1);
}

const REQUIRED = ["mimetype", "META-INF/container.xml", "Contents/content.hpf"];
const buf = fs.readFileSync(hwpxPath);
const zip = await JSZip.loadAsync(buf);
const names = Object.keys(zip.files);
const issues = [];
let score = 100;

for (const req of REQUIRED) {
  const found = names.some((n) => n === req || n.endsWith(req.split("/").pop()));
  if (!found) {
    issues.push(`missing:${req}`);
    score -= 15;
  }
}

if (!names.some((n) => n.includes("section") && n.endsWith(".xml"))) {
  issues.push("missing:section xml");
  score -= 20;
}

const parser = new XMLParser({ ignoreAttributes: false });
for (const name of names.filter((n) => n.endsWith(".xml"))) {
  try {
    const xml = await zip.file(name).async("string");
    parser.parse(xml);
  } catch {
    issues.push(`xml_parse:${name}`);
    score -= 10;
  }
}

score = Math.max(0, Math.min(100, score));
const passed = score >= 70;

console.log(JSON.stringify({ score, passed, issues, validator: "dvc-lite-local" }, null, 2));
process.exit(passed ? 0 : 1);
