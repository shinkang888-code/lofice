"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HwpDocument } from "@rhwp/core";
import { Loader2 } from "lucide-react";
import { initRhwp } from "@/lib/rhwp/setup";
import type { RhwpPageInfo } from "@/lib/rhwp/types";
import { useViewerToolbarOptional } from "@/components/office/ViewerToolbarContext";
import RhwpPageCanvas from "./RhwpPageCanvas";

interface Props {
  buffer: ArrayBuffer;
  fileName: string;
  onFallback?: () => void;
}

function fitScale(pageWidth: number, containerWidth: number): number {
  const pad = 32;
  return Math.min(2, Math.max(0.3, (containerWidth - pad) / pageWidth));
}

export default function RhwpCanvasViewer({ buffer, fileName, onFallback }: Props) {
  const toolbar = useViewerToolbarOptional();
  const scrollRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<HwpDocument | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<RhwpPageInfo[]>([]);
  const [scale, setScale] = useState(1);
  const [baseScale, setBaseScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const pageCount = pages.length;
  const zoomFactor = scale / baseScale;

  useEffect(() => {
    let cancelled = false;
    let doc: HwpDocument | null = null;

    async function load() {
      setLoading(true);
      setError(null);
      setPages([]);

      try {
        const rhwp = await initRhwp();
        doc = new rhwp.HwpDocument(new Uint8Array(buffer));
        docRef.current = doc;

        const count = doc.pageCount();
        const infos: RhwpPageInfo[] = [];
        for (let i = 0; i < count; i++) {
          infos.push(JSON.parse(doc.getPageInfo(i)) as RhwpPageInfo);
        }

        if (cancelled) {
          doc.free();
          return;
        }

        const containerWidth = scrollRef.current?.clientWidth ?? window.innerWidth;
        const fitted = infos.length > 0 ? fitScale(infos[0].width, containerWidth) : 1;

        setPages(infos);
        setBaseScale(fitted);
        setScale(fitted);
      } catch (e) {
        if (!cancelled) {
          if (onFallback) onFallback();
          else setError(e instanceof Error ? e.message : "HWP 렌더링 실패");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      doc?.free();
      docRef.current = null;
    };
  }, [buffer, onFallback]);

  const scrollToPage = useCallback((page: number) => {
    const el = scrollRef.current?.querySelector(`[data-page="${page}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setCurrentPage(page);
  }, []);

  const handleDownload = useCallback(() => {
    const blob = new Blob([buffer], { type: "application/x-hwp" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }, [buffer, fileName]);

  const zoomIn = useCallback(() => setScale((s) => Math.min(baseScale * 3, s * 1.15)), [baseScale]);
  const zoomOut = useCallback(() => setScale((s) => Math.max(baseScale * 0.4, s / 1.15)), [baseScale]);
  const zoomFit = useCallback(() => setScale(baseScale), [baseScale]);
  const zoomReset = useCallback(() => setScale(baseScale * 1.25), [baseScale]);
  const prevPage = useCallback(() => scrollToPage(Math.max(1, currentPage - 1)), [currentPage, scrollToPage]);
  const nextPage = useCallback(() => scrollToPage(Math.min(pageCount, currentPage + 1)), [currentPage, pageCount, scrollToPage]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root || pageCount === 0) return;
    const onScroll = () => {
      const pageEls = root.querySelectorAll<HTMLElement>("[data-page]");
      const top = root.scrollTop + 80;
      let active = 1;
      pageEls.forEach((p) => {
        if (p.offsetTop <= top) active = Number(p.dataset.page) || active;
      });
      setCurrentPage(active);
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, [pageCount, loading]);

  useEffect(() => {
    toolbar?.register({
      docType: "hwp",
      page: currentPage,
      pageCount,
      zoom: zoomFactor,
      canPageNav: pageCount > 1,
      actions: {
        zoomIn,
        zoomOut,
        zoomFit,
        zoomReset,
        prevPage,
        nextPage,
        goToPage: scrollToPage,
        download: handleDownload,
      },
    });
    return () => toolbar?.reset();
  }, [
    toolbar, currentPage, pageCount, zoomFactor,
    zoomIn, zoomOut, zoomFit, zoomReset, prevPage, nextPage, scrollToPage, handleDownload,
  ]);

  const doc = docRef.current;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 bg-[#888]">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
        <p className="text-sm text-white/80">hwpreader WASM Canvas 렌더링 중...</p>
      </div>
    );
  }

  if (error || !doc || pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 px-6 text-center bg-[#888]">
        <p className="text-red-300 font-medium">HWP 뷰어 오류</p>
        <p className="text-sm text-white/70">{error ?? "페이지 없음"}</p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="h-full overflow-auto overscroll-contain py-6 px-2 bg-[#888]">
      <div className="mx-auto" style={{ width: "fit-content" }}>
        {pages.map((info, i) => (
          <RhwpPageCanvas
            key={i}
            doc={doc}
            pageIndex={i}
            scale={scale}
            width={info.width}
            height={info.height}
            priority={i === 0}
          />
        ))}
      </div>
    </div>
  );
}
