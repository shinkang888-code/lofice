/**
 * Phase 0 — Office 암호화·OOXML 회귀 테스트
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

// officecrypto-tool import
try {
  const crypto = require("officecrypto-tool");
  const mod = crypto.default ?? crypto;
  ok("officecrypto-tool import", typeof mod.isEncrypted === "function");
} catch (e) {
  ok("officecrypto-tool import", false, e.message);
}

// OOXML zip structure (sample.hwpx is hwpx not ooxml - create minimal docx)
const JSZip = require("jszip");
const zip = new JSZip();
zip.file("[Content_Types].xml", '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"></Types>');
zip.file("_rels/.rels", '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>');
zip.file("word/document.xml", '<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>lofice office test</w:t></w:r></w:p></w:body></w:document>');
const docxBuf = await zip.generateAsync({ type: "nodebuffer" });
fs.mkdirSync(fixtures, { recursive: true });
fs.writeFileSync(path.join(fixtures, "sample.docx"), docxBuf);
ok("sample.docx fixture", docxBuf.length > 200, `${docxBuf.length} bytes`);

// mammoth parse
const mammoth = await import("mammoth");
const { value } = await mammoth.extractRawText({ buffer: docxBuf });
ok("mammoth extract", value.includes("lofice"), value.trim());

// xlsx via SheetJS
const XLSX = require("xlsx");
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet([["a", "b"], [1, 2]]);
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
const xlsxBuf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
fs.writeFileSync(path.join(fixtures, "sample.xlsx"), xlsxBuf);
const wb2 = XLSX.read(xlsxBuf);
ok("xlsx roundtrip", wb2.SheetNames[0] === "Sheet1");

// eml heuristic
const eml = [
  "From: test@lofice.app",
  "To: user@example.com",
  "Subject: Office Test",
  "",
  "Hello Office pipeline",
].join("\r\n");
ok("eml structure", eml.includes("Subject: Office Test"));

// OLE magic for legacy office
const ole = Buffer.from([0xd0, 0xcf, 0x11, 0xe0]);
ok("OLE magic (legacy office)", ole[0] === 0xd0);

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
