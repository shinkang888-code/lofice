"use client";

import { useMemo } from "react";
import { Viewer, useRegistry } from "@microscope-js/react";
import { pptxRenderer } from "@microscope-js/renderer-pptx";
import { Loader2 } from "lucide-react";

interface Props {
  buffer: ArrayBuffer;
  fileName: string;
}

/** @microscope-js/renderer-pptx 폴백 뷰어 */
export default function MicroscopePptxViewer({ buffer, fileName }: Props) {
  const registry = useRegistry([pptxRenderer]);
  const source = useMemo(
    () => new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" }),
    [buffer],
  );

  return (
    <Viewer
      source={source}
      registry={registry}
      className="h-full w-full microscope-pptx-viewer bg-[#0d0d0f]"
      style={{ height: "100%", minHeight: 400, border: "none", borderRadius: 0 }}
      loadingFallback={
        <div className="flex flex-col items-center justify-center h-full gap-2 bg-[#0d0d0f]">
          <Loader2 className="w-7 h-7 animate-spin text-[#5b8def]" />
          <p className="text-xs text-[#8a8a93]">microscope-js PPT 뷰어...</p>
        </div>
      }
      errorFallback={(err) => (
        <div className="flex flex-col items-center justify-center h-full gap-2 px-4 text-center text-[#e6e6e9]">
          <p className="text-red-400 text-sm font-medium">PPT 뷰어 오류</p>
          <p className="text-xs text-[#8a8a93]">{err.message}</p>
          <p className="text-xs text-[#8a8a93]">{fileName}</p>
        </div>
      )}
    />
  );
}
