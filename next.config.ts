import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  transpilePackages: [
    "@ssabrojs/hwpxjs",
    "pdfjs-dist",
    "@eigenpal/docx-editor-react",
    "@docmentis/udoc-viewer",
    "@rhwp/core",
    "@rhwp/editor",
    "@microscope-js/react",
    "@microscope-js/core",
    "@microscope-js/renderer-pdf",
    "@microscope-js/renderer-docx",
    "@microscope-js/renderer-xlsx",
    "@microscope-js/renderer-image",
    "@microscope-js/renderer-pptx",
    "officecrypto-tool",
  ],
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        https: false,
        http: false,
        stream: false,
        zlib: false,
        crypto: false,
        module: false,
        buffer: require.resolve("buffer/"),
      };
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
        }),
      );
    }
    return config;
  },
};

export default nextConfig;
