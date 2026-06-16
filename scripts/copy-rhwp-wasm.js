const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "../node_modules/@rhwp/core/rhwp_bg.wasm");
const dest = path.join(__dirname, "../public/rhwp_bg.wasm");

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log("Copied rhwp_bg.wasm to public/");
} else {
  console.warn("rhwp_bg.wasm not found — run npm install @rhwp/core");
}
