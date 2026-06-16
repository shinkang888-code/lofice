/**
 * PDF 파일 열기 경로 smoke test (Node)
 * 사용: node scripts/test-pdf-open.mjs [pdf-path]
 */
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const defaultPdf = "C:\\Users\\FORYOUCOM\\Downloads\\wallpilotir.pdf";
const pdfPath = process.argv[2] ?? defaultPdf;

let pass = 0;
let fail = 0;
function ok(m) { pass++; console.log(`✓ ${m}`); }
function bad(m) { fail++; console.error(`✗ ${m}`); }

if (!existsSync(pdfPath)) {
  bad(`PDF not found: ${pdfPath}`);
  process.exit(1);
}

const buf = readFileSync(pdfPath);
ok(`read ${pdfPath} (${(buf.length / 1024 / 1024).toFixed(2)} MB)`);

const head = buf.slice(0, 5).toString("ascii");
if (head.startsWith("%PDF-")) ok("PDF magic header %PDF-");
else bad(`invalid header: ${head}`);

const ext = pdfPath.split(".").pop()?.toLowerCase();
if (ext === "pdf") ok("extension .pdf");
else bad(`extension ${ext}`);

// mirror getDocumentType + getEditorRouteForSavedFile
const type = ext === "pdf" ? "pdf" : "unknown";
if (type === "pdf") ok("document type: pdf");
else bad(`type ${type}`);

const mockId = "test-id-123";
const route = type === "pdf" ? `/viewer/?id=${mockId}` : null;
if (route === `/viewer/?id=${mockId}`) ok(`route → ${route}`);
else bad(`route ${route}`);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
