const fs = require("fs");
const path = require("path");

function copyIfExists(src, dest, label) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${label} → ${path.relative(process.cwd(), dest)}`);
    return true;
  }
  console.warn(`${label} not found at ${src}`);
  return false;
}

const root = path.join(__dirname, "..");

copyIfExists(
  path.join(root, "node_modules/@rhwp/core/rhwp_bg.wasm"),
  path.join(root, "public/rhwp_bg.wasm"),
  "rhwp_bg.wasm"
);

copyIfExists(
  path.join(root, "node_modules/pdfjs-dist/build/pdf.worker.min.mjs"),
  path.join(root, "public/pdf.worker.min.mjs"),
  "pdf.worker.min.mjs"
);

copyIfExists(
  path.join(root, "node_modules/pptxgenjs/dist/pptxgen.bundle.js"),
  path.join(root, "public/vendor/pptxgen.bundle.js"),
  "pptxgen.bundle.js"
);

const udocSrc = path.join(root, "node_modules/@docmentis/udoc-viewer/dist/src");
copyIfExists(path.join(udocSrc, "wasm/udoc_bg.wasm"), path.join(root, "public/udoc/udoc_bg.wasm"), "udoc_bg.wasm");
copyIfExists(path.join(udocSrc, "worker/worker.js"), path.join(root, "public/udoc/worker.js"), "udoc worker.js");

