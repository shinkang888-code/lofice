/**
 * OOXML-lite 로컬 검증 (office-ooxml-validate 동일 규칙)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const JSZip = require("jszip");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docxPath = path.join(__dirname, "../test-fixtures/sample.docx");

if (!fs.existsSync(docxPath)) {
  console.error("sample.docx missing — run: npm run test:office");
  process.exit(1);
}

const buf = fs.readFileSync(docxPath);
const zip = await JSZip.loadAsync(buf);
const names = Object.keys(zip.files);
const required = ["[Content_Types].xml", "word/document.xml", "_rels/.rels"];
const issues = [];
let score = 100;

for (const req of required) {
  if (!names.includes(req)) {
    issues.push(`missing:${req}`);
    score -= 20;
  }
}

score = Math.max(0, Math.min(100, score));
const passed = score >= 70;
console.log(JSON.stringify({ score, passed, issues, validator: "ooxml-lite-local" }, null, 2));
process.exit(passed ? 0 : 1);
