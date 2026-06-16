const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const toIco = require("to-ico");

async function main() {
  const pngPath = path.join(__dirname, "../public/lofice-icon.png");
  const icoPath = path.join(__dirname, "../build/icon.ico");

  const sizes = [16, 32, 48, 64, 128, 256];
  const buffers = await Promise.all(
    sizes.map((size) =>
      sharp(pngPath).resize(size, size).png().toBuffer()
    )
  );

  const ico = await toIco(buffers);
  fs.mkdirSync(path.dirname(icoPath), { recursive: true });
  fs.writeFileSync(icoPath, ico);
  console.log("Generated:", icoPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
