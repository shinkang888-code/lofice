"use client";

import ScrollCanvas from "@/components/document/ScrollCanvas";

interface Props {
  url: string;
  fileName: string;
  mimeType?: string;
}

export default function ImageViewer({ url, fileName, mimeType }: Props) {
  const isSvg = mimeType === "image/svg+xml" || fileName.endsWith(".svg");

  return (
    <ScrollCanvas showZoom bgClassName="bg-[#2a2a2a]">
      <div className="flex items-center justify-center min-w-max min-h-full">
        {isSvg ? (
          <img
            src={url}
            alt={fileName}
            className="max-w-none shadow-2xl"
            style={{ maxHeight: "none" }}
          />
        ) : (
          <img
            src={url}
            alt={fileName}
            className="shadow-2xl"
            style={{ maxWidth: "none", height: "auto" }}
          />
        )}
      </div>
    </ScrollCanvas>
  );
}
