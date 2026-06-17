/**
 * Office OOXML 테스트 픽스처 생성
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../test-fixtures");
fs.mkdirSync(dir, { recursive: true });

const XLSX = require("xlsx");
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet([
  ["lofice", "Office", "Test"],
  [1, 2, 3],
]);
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
XLSX.writeFile(wb, path.join(dir, "sample.xlsx"));

const { HwpxWriter } = await import("@ssabrojs/hwpxjs");
const writer = new HwpxWriter();
const hwpxBytes = await writer.createFromPlainText("Office pipeline test", { title: "sample", creator: "lofice" });
fs.writeFileSync(path.join(dir, "sample-office.hwpx"), Buffer.from(hwpxBytes));

console.log("Created Office fixtures in", dir);
