"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { initRhwp } from "@/lib/rhwp/setup";
import { useViewerToolbarOptional } from "@/components/office/ViewerToolbarContext";

interface Props {
  buffer: ArrayBuffer;
  fileName: string;
  onFallback?: () => void;
}

export default function RhwpViewer({ buffer, fileName, onFallback }: Props) {
  const toolbar = useViewerToolbarOptional();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [svg, setSvg] = useState("");

  const renderPage = useCallback(async (pageNum: number, data: ArrayBuffer) => {
    const { HwpDocument } = await initRhwp();
    const doc = new HwpDocument(new Uint8Array(data));
    const total = doc.pageCount();
    const idx = Math.min(Math.max(0, pageNum - 1), total - 1);
    const html = doc.renderPageSvg(idx);
    return { html, total };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    renderPage(page, buffer)
      .then(({ html, total }) => {
        if (cancelled) return;
        setSvg(html);
        setPageCount(total);
      })
      .catch((e) => {
        if (!cancelled) {
          if (onFallback) onFallback();
          else setError(e instanceof Error ? e.message : "HWP 렌더링 실패");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [buffer, page, renderPage, onFallback]);

  const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const nextPage = useCallback(() => setPage((p) => Math.min(pageCount, p + 1)), [pageCount]);

  useEffect(() => {
    toolbar?.register({
      docType: "hwp",
      page,
      pageCount,
      zoom: 1,
      canPageNav: pageCount > 1,
      actions: { prevPage, nextPage, goToPage: setPage },
    });
    return () => toolbar?.reset();
  }, [toolbar, page, pageCount, prevPage, nextPage]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 bg-[#e8e8e8]">
        <Loader2 className="w-8 h-8 text-lofice-navy animate-spin" />
        <p className="text-sm text-gray-600">@rhwp/core WASM으로 HWP 렌더링 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 px-6 text-center">
        <p className="text-red-600 font-medium">HWP 뷰어 오류</p>
        <p className="text-sm text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#888]">
      <div className="shrink-0 flex items-center justify-center gap-3 py-2 bg-[#2b579a] text-white text-xs">
        <button type="button" onClick={prevPage} disabled={page <= 1} className="p-1 disabled:opacity-30">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span>{page} / {pageCount}</span>
        <button type="button" onClick={nextPage} disabled={page >= pageCount} className="p-1 disabled:opacity-30">
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="opacity-70 truncate max-w-[40%]">{fileName}</span>
      </div>
      <div className="flex-1 overflow-auto p-4 flex justify-center">
        <div
          className="rhwp-page bg-white shadow-xl max-w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  );
}
