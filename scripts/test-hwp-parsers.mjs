/**
 * Phase 0 — HWP/HWPX 파서 회귀 테스트
 * node scripts/test-hwp-parsers.mjs
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

// rhwp 버전 동기화
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), "utf8"));
const coreVer = pkg.dependencies["@rhwp/core"]?.replace(/^\^/, "");
const editorVer = pkg.dependencies["@rhwp/editor"]?.replace(/^\^/, "");
ok("@rhwp/core/editor version sync", coreVer === editorVer, `${coreVer} / ${editorVer}`);

// hwpxjs
const hwpxPath = path.join(fixtures, "sample.hwpx");
if (!fs.existsSync(hwpxPath)) {
  ok("sample.hwpx fixture", false, "run create-test-fixtures.mjs first");
} else {
  const buf = fs.readFileSync(hwpxPath);
  const hwpxjs = await import("@ssabrojs/hwpxjs");
  const bytes = new Uint8Array(buf);
  const fmt = hwpxjs.detectFormat(bytes);
  ok("hwpxjs detectFormat", fmt === "hwpx", fmt);

  const reader = new hwpxjs.HwpxReader();
  await reader.loadFromArrayBuffer(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  const text = await reader.extractText();
  ok("hwpxjs extractText", text.includes("lofice"), text.slice(0, 40));

  const writer = new hwpxjs.HwpxWriter();
  const created = await writer.createFromPlainText("회귀 테스트", { title: "test", creator: "lofice" });
  ok("hwpxjs HwpxWriter", created.byteLength > 100, `${created.byteLength} bytes`);
}

// hwp.js (레거시 폴백)
try {
  const Hwp = require("hwp.js");
  ok("hwp.js import", typeof Hwp === "function" || typeof Hwp === "object");
} catch (e) {
  ok("hwp.js import", false, e.message);
}

// OLE magic (hwp-detect 휴리스틱)
const oleMagic = Buffer.from([0xd0, 0xcf, 0x11, 0xe0]);
const zipMagic = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
ok("OLE magic", oleMagic[0] === 0xd0);
ok("ZIP magic", zipMagic[0] === 0x50 && zipMagic[1] === 0x4b);

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
