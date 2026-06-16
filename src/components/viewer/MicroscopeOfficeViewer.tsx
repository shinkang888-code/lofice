"use client";

import { useMemo } from "react";
import { Viewer, useRegistry } from "@microscope-js/react";
import { pdfRenderer } from "@microscope-js/renderer-pdf";
import { docxRenderer } from "@microscope-js/renderer-docx";
import { xlsxRenderer } from "@microscope-js/renderer-xlsx";
import { imageRenderer } from "@microscope-js/renderer-image";
import { Loader2 } from "lucide-react";

interface Props {
  buffer: ArrayBuffer;
  fileName: string;
  mimeType?: string;
}

/**
 * @microscope-js/react 패턴 — SSR-safe lazy registry, 클라이언트 전용 렌더
 */
export default function MicroscopeOfficeViewer({ buffer, fileName, mimeType }: Props) {
  const registry = useRegistry([pdfRenderer, docxRenderer, xlsxRenderer, imageRenderer]);

  const source = useMemo(() => {
    const type = mimeType ?? guessMime(fileName);
    return new Blob([buffer], { type });
  }, [buffer, fileName, mimeType]);

  return (
    <Viewer
      source={source}
      registry={registry}
      className="h-full w-full microscope-viewer"
      style={{ height: "100%", minHeight: 400, border: "none", borderRadius: 0 }}
      loadingFallback={
        <div className="flex flex-col items-center justify-center h-full gap-2 bg-[#f3f3f3]">
          <Loader2 className="w-7 h-7 animate-spin text-lofice-navy" />
          <p className="text-xs text-gray-500">microscope-js 뷰어 로딩...</p>
        </div>
      }
      errorFallback={(err) => (
        <div className="flex flex-col items-center justify-center h-full gap-2 px-4 text-center">
          <p className="text-red-600 text-sm font-medium">뷰어 오류</p>
          <p className="text-xs text-gray-500">{err.message}</p>
        </div>
      )}
    />
  );
}

function guessMime(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    doc: "application/msword",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xls: "application/vnd.ms-excel",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
  };
  return map[ext] ?? "application/octet-stream";
}
