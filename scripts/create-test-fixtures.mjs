import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../test-fixtures");
fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(path.join(dir, "sample.pdf"), "%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF");
fs.writeFileSync(path.join(dir, "sample.txt"), "Hello lofice\nLine 2");
fs.writeFileSync(path.join(dir, "sample.md"), "# Title\n\n**bold** text\n- item");
fs.writeFileSync(path.join(dir, "sample.json"), JSON.stringify({ ok: true, name: "lofice" }, null, 2));
fs.writeFileSync(path.join(dir, "sample.html"), "<!DOCTYPE html><html><body><h1>Hi</h1></body></html>");
fs.writeFileSync(path.join(dir, "sample.csv"), "a,b\n1,2");

console.log("Created test fixtures in", dir);
