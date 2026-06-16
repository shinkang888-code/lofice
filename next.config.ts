import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  transpilePackages: [
    "@ssabrojs/hwpxjs",
    "pdfjs-dist",
    "@eigenpal/docx-js-editor",
    "@rhwp/core",
    "@microscope-js/react",
    "@microscope-js/core",
    "@microscope-js/renderer-pdf",
    "@microscope-js/renderer-docx",
    "@microscope-js/renderer-xlsx",
    "@microscope-js/renderer-image",
  ],
};

export default nextConfig;
