/**
 * v2.4–v2.11 이식 모듈 smoke test (Node)
 */
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let pass = 0;
let fail = 0;

function ok(label) {
  pass++;
  console.log(`✓ ${label}`);
}
function bad(label, err) {
  fail++;
  console.error(`✗ ${label}`, err ?? "");
}

function fileExists(rel) {
  const p = join(root, rel);
  if (!existsSync(p)) {
    bad(`missing file: ${rel}`);
    return false;
  }
  ok(`file: ${rel}`);
  return true;
}

// Routes / pages
const routes = [
  "src/app/toolbox/page.tsx",
  "src/app/convert/page.tsx",
  "src/app/office-crypto/page.tsx",
  "src/app/migrate/page.tsx",
  "src/app/ppt-ai/page.tsx",
  "src/app/ppt-editor/page.tsx",
  "src/app/archive/page.tsx",
  "src/app/pdf-editor/page.tsx",
];
routes.forEach((r) => fileExists(r));

// Lib modules
const libs = [
  "src/lib/officeTool/preferences.ts",
  "src/lib/msoffice/office-crypto.ts",
  "src/lib/msoffice/migration-stages.ts",
  "src/lib/pptMcp/config.ts",
  "src/lib/powerpoint/deck.ts",
  "src/lib/powerpoint/ai-deck.ts",
  "src/lib/pptGenerator/generate.ts",
  "src/lib/pptxGenJS/builder.ts",
  "src/lib/pptxGenJS/client.ts",
  "src/lib/reactTypes/events.ts",
  "services/ppt-mcp-api/main.py",
  "services/ppt-mcp-api/ppt_generator.py",
];
libs.forEach((r) => fileExists(r));

// PptxGenJS vendor bundle (postinstall)
if (existsSync(join(root, "public/vendor/pptxgen.bundle.js"))) {
  ok("public/vendor/pptxgen.bundle.js");
} else {
  bad("public/vendor/pptxgen.bundle.js (run npm run postinstall)");
}

// package version
try {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  if (pkg.version === "2.11.0") ok(`version ${pkg.version}`);
  else bad(`version expected 2.11.0 got ${pkg.version}`);
} catch (e) {
  bad("package.json", e.message);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
