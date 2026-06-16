import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  transpilePackages: ["@ssabrojs/hwpxjs", "pdfjs-dist"],
};

export default nextConfig;
