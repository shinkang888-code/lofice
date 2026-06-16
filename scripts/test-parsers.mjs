/**
 * 파서 스모크 테스트 — node scripts/test-parsers.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtures = path.join(__dirname, "../test-fixtures");

const results = [];

function ok(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
}

// TXT / MD / JSON / HTML
const txt = fs.readFileSync(path.join(fixtures, "sample.txt"));
ok("TXT decode", new TextDecoder().decode(txt).includes("lofice"));

const md = fs.readFileSync(path.join(fixtures, "sample.md"), "utf8");
ok("MD content", md.startsWith("#"));

const json = JSON.parse(fs.readFileSync(path.join(fixtures, "sample.json"), "utf8"));
ok("JSON parse", json.ok === true);

const html = fs.readFileSync(path.join(fixtures, "sample.html"), "utf8");
ok("HTML content", html.includes("<h1>"));

// PDF signature
const pdf = fs.readFileSync(path.join(fixtures, "sample.pdf"));
ok("PDF signature", pdf.toString("ascii", 0, 5) === "%PDF-");

// CSV / XLSX via xlsx
const XLSX = require("xlsx");
const csvBuf = fs.readFileSync(path.join(fixtures, "sample.csv"));
const wb = XLSX.read(csvBuf);
ok("CSV/XLSX parse", wb.SheetNames.length > 0);

// PDF.js
const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
const pdfData = new Uint8Array(pdf);
try {
  const doc = await pdfjs.getDocument({ data: pdfData, useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true }).promise;
  ok("PDF.js load", doc.numPages >= 1, `${doc.numPages} page(s)`);
} catch (e) {
  ok("PDF.js load", false, e.message);
}

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
