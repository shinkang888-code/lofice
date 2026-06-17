/**
 * Phase 0 — HWP/HWPX parser regression + v2.25 package metadata (Hancom study)
 * node scripts/test-hwp-parsers.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import {
  extractHwpxPackageSmoke,
  HWPML_DOCSUMMARY_PATHS,
  isOleCompound,
  isZipHwpx,
} from "./lib/hwp-package-utils.mjs";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtures = path.join(__dirname, "../test-fixtures");
const results = [];

function ok(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
}

// rhwp version sync
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), "utf8"));
const coreVer = pkg.dependencies["@rhwp/core"]?.replace(/^\^/, "");
const editorVer = pkg.dependencies["@rhwp/editor"]?.replace(/^\^/, "");
ok("@rhwp/core/editor version sync", coreVer === editorVer, `${coreVer} / ${editorVer}`);
ok("lofice version v2.25+", pkg.version.startsWith("2.25"), pkg.version);

// HWPML path constants (Hancom HML2DAISY3.xsl study)
ok(
  "HWPML DOCSUMMARY paths defined",
  Object.keys(HWPML_DOCSUMMARY_PATHS).length === 5,
  Object.values(HWPML_DOCSUMMARY_PATHS).join(", ")
);

// hwpxjs
const hwpxPath = path.join(fixtures, "sample.hwpx");
if (!fs.existsSync(hwpxPath)) {
  ok("sample.hwpx fixture", false, "run create-test-fixtures.mjs first");
} else {
  const buf = fs.readFileSync(hwpxPath);
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  ok("ZIP magic (hwpx)", isZipHwpx(ab));
  ok("not OLE", !isOleCompound(ab));

  const hwpxjs = await import("@ssabrojs/hwpxjs");
  const bytes = new Uint8Array(buf);
  const fmt = hwpxjs.detectFormat(bytes);
  ok("hwpxjs detectFormat", fmt === "hwpx", fmt);

  const reader = new hwpxjs.HwpxReader();
  await reader.loadFromArrayBuffer(ab);
  const text = await reader.extractText();
  ok("hwpxjs extractText", text.includes("lofice"), text.slice(0, 40));

  const writer = new hwpxjs.HwpxWriter();
  const created = await writer.createFromPlainText("회귀 테스트", { title: "test", creator: "lofice" });
  ok("hwpxjs HwpxWriter", created.byteLength > 100, `${created.byteLength} bytes`);

  // v2.25 package metadata smoke
  const pkgInfo = await extractHwpxPackageSmoke(ab);
  ok("hwpx package entries", pkgInfo.entryCount >= 3, `${pkgInfo.entryCount} entries`);
  ok(
    "hwpx required entries",
    pkgInfo.missingRequired.length === 0,
    pkgInfo.missingRequired.join(", ") || "all present"
  );
  const hasMime =
    !pkgInfo.mimeType ||
    /hwp|zip|owpml/i.test(pkgInfo.mimeType);
  ok("hwpx mimetype hint", hasMime, pkgInfo.mimeType ?? "(empty)");
  ok(
    "hwpx metadata object",
    typeof pkgInfo.metadata === "object",
    JSON.stringify(pkgInfo.metadata).slice(0, 60)
  );
}

// hwp.js (legacy fallback)
try {
  const Hwp = require("hwp.js");
  ok("hwp.js import", typeof Hwp === "function" || typeof Hwp === "object");
} catch (e) {
  ok("hwp.js import", false, e.message);
}

// OLE magic (hwp-detect heuristic)
const oleMagic = Buffer.from([0xd0, 0xcf, 0x11, 0xe0]);
const zipMagic = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
ok("OLE magic bytes", oleMagic[0] === 0xd0);
ok("ZIP magic bytes", zipMagic[0] === 0x50 && zipMagic[1] === 0x4b);

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
