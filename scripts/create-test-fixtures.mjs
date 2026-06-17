import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../test-fixtures");
fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(path.join(dir, "sample.pdf"), "%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF");
fs.writeFileSync(path.join(dir, "sample.txt"), "Hello lofice\nLine 2");
fs.writeFileSync(path.join(dir, "sample.md"), "# Title\n\n**bold** text\n- item");
fs.writeFileSync(path.join(dir, "sample.json"), JSON.stringify({ ok: true, name: "lofice" }, null, 2));
fs.writeFileSync(path.join(dir, "sample.html"), "<!DOCTYPE html><html><body><h1>Hi</h1></body></html>");
fs.writeFileSync(path.join(dir, "sample.csv"), "a,b\n1,2");

// Phase 0 — sample.hwpx (HwpxWriter)
async function createHwpx() {
  const { HwpxWriter } = await import("@ssabrojs/hwpxjs");
  const writer = new HwpxWriter();
  const bytes = await writer.createFromPlainText("lofice HWP 회귀 테스트 문서", {
    title: "sample",
    creator: "lofice",
  });
  const out = path.join(dir, "sample.hwpx");
  fs.writeFileSync(out, Buffer.from(bytes));
  console.log("Created", out);
}

await createHwpx();
console.log("Created test fixtures in", dir);
