"use client";

import { useEffect, useRef, useState } from "react";
import ScrollCanvas from "@/components/document/ScrollCanvas";
import { Loader2 } from "lucide-react";

interface Props {
  buffer: ArrayBuffer;
  fileName: string;
}

export default function PdfViewer({ buffer, fileName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    async function render() {
      setLoading(true);
      setError(null);
      container!.innerHTML = "";

      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const data = new Uint8Array(buffer.slice(0));
        const pdf = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
        if (cancelled) return;

        setPageCount(pdf.numPages);

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return;
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          canvas.className = "mx-auto shadow-lg mb-6 bg-white block";
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: ctx, viewport }).promise;
          if (!cancelled) container!.appendChild(canvas);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "PDF를 렌더링하지 못했습니다.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    render();
    return () => {
      cancelled = true;
      if (container) container.innerHTML = "";
    };
  }, [buffer, fileName]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 bg-[#c8c8c8]">
        <Loader2 className="w-8 h-8 text-lofice-navy animate-spin" />
        <p className="text-sm text-gray-600">PDF 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 px-6 bg-[#c8c8c8]">
        <p className="text-red-600 font-medium">PDF를 열 수 없습니다</p>
        <p className="text-sm text-gray-600 text-center max-w-md">{error}</p>
        <p className="text-xs text-gray-400">{fileName}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollCanvas showZoom bgClassName="bg-[#c8c8c8]">
        <div ref={containerRef} className="py-4 min-w-max" />
      </ScrollCanvas>
      <div className="shrink-0 px-4 py-1.5 bg-[#f0f0f0] border-t border-gray-300 text-xs text-gray-500 flex justify-between">
        <span>PDF · {pageCount}페이지</span>
        <span className="truncate ml-4">{fileName}</span>
      </div>
    </div>
  );
}
