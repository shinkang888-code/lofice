"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { Loader2 } from "lucide-react";
import { openPdfDocument, fitScale } from "@/lib/pdf/pdf-engine";
import { useViewerToolbarOptional } from "@/components/office/ViewerToolbarContext";
import PdfPageCanvas from "./PdfPageCanvas";

interface Props {
  buffer: ArrayBuffer;
  fileName: string;
}

export default function PdfViewer({ buffer, fileName }: Props) {
  const toolbar = useViewerToolbarOptional();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [scale, setScale] = useState(1);
  const [baseScale, setBaseScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageHeight, setPageHeight] = useState(842);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [thumbUrls, setThumbUrls] = useState<string[]>([]);

  const zoomFactor = scale / baseScale;

  const scrollToPage = useCallback((page: number) => {
    const el = scrollRef.current?.querySelector(`[data-page="${page}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setCurrentPage(page);
  }, []);

  const handleDownload = useCallback(() => {
    const blob = new Blob([buffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }, [buffer, fileName]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const zoomIn = useCallback(() => setScale((s) => Math.min(baseScale * 3, s * 1.15)), [baseScale]);
  const zoomOut = useCallback(() => setScale((s) => Math.max(baseScale * 0.4, s / 1.15)), [baseScale]);
  const zoomFit = useCallback(() => setScale(baseScale), [baseScale]);
  const zoomReset = useCallback(() => setScale(baseScale * 1.25), [baseScale]);

  const prevPage = useCallback(() => {
    scrollToPage(Math.max(1, currentPage - 1));
  }, [currentPage, scrollToPage]);

  const nextPage = useCallback(() => {
    scrollToPage(Math.min(pageCount, currentPage + 1));
  }, [currentPage, pageCount, scrollToPage]);

  const toggleThumbnails = useCallback(() => setShowThumbnails((v) => !v), []);

  // PDF 문서 열기 — 첫 페이지 메타만 즉시 로드
  useEffect(() => {
    let cancelled = false;
    let pdf: PDFDocumentProxy | null = null;

    async function load() {
      setLoading(true);
      setError(null);
      setThumbUrls([]);
      setPdfDoc(null);

      try {
        pdf = await openPdfDocument(buffer);
        if (cancelled) {
          pdf.destroy();
          return;
        }

        setPdfDoc(pdf);
        setPageCount(pdf.numPages);

        const first = await pdf.getPage(1);
        const viewport = first.getViewport({ scale: 1 });
        const containerWidth = scrollRef.current?.clientWidth ?? window.innerWidth;
        const fitted = fitScale(viewport.width, containerWidth);
        setBaseScale(fitted);
        setScale(fitted);
        setPageHeight(viewport.height * fitted);
        first.cleanup();
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "PDF를 렌더링하지 못했습니다.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      pdf?.destroy();
    };
  }, [buffer, fileName]);

  // 스크롤 시 현재 페이지 추적
  useEffect(() => {
    const root = scrollRef.current;
    if (!root || pageCount === 0) return;

    const onScroll = () => {
      const pages = root.querySelectorAll<HTMLElement>("[data-page]");
      const top = root.scrollTop + 80;
      let active = 1;
      pages.forEach((p) => {
        if (p.offsetTop <= top) active = Number(p.dataset.page) || active;
      });
      setCurrentPage(active);
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, [pageCount, loading]);

  // 리본 툴바 연동
  useEffect(() => {
    toolbar?.register({
      docType: "pdf",
      page: currentPage,
      pageCount,
      zoom: zoomFactor,
      showThumbnails,
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
        print: handlePrint,
        toggleThumbnails,
      },
    });
  }, [
    toolbar,
    currentPage,
    pageCount,
    zoomFactor,
    showThumbnails,
    zoomIn,
    zoomOut,
    zoomFit,
    zoomReset,
    prevPage,
    nextPage,
    scrollToPage,
    handleDownload,
    handlePrint,
    toggleThumbnails,
  ]);

  useEffect(() => () => toolbar?.reset(), [toolbar]);

  // 썸네일 (백그라운드, 저해상도)
  useEffect(() => {
    const pdf = pdfDoc;
    if (!showThumbnails || !pdf || pageCount === 0) return;

    let cancelled = false;
    async function buildThumbs() {
      const urls: string[] = [];
      for (let i = 1; i <= Math.min(pageCount, 20); i++) {
        if (cancelled) break;
        const page = await pdf!.getPage(i);
        const vp = page.getViewport({ scale: 0.15 });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport: vp }).promise;
          urls.push(canvas.toDataURL("image/jpeg", 0.6));
        }
        page.cleanup();
      }
      if (!cancelled) setThumbUrls(urls);
    }
    buildThumbs();
    return () => {
      cancelled = true;
    };
  }, [showThumbnails, pageCount, pdfDoc]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 bg-[#525659]">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
        <p className="text-sm text-white/80">PDF 불러오는 중...</p>
        <p className="text-xs text-white/50">첫 페이지를 우선 표시합니다</p>
      </div>
    );
  }

  if (error || !pdfDoc) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 px-6 bg-[#525659]">
        <p className="text-red-300 font-medium">PDF를 열 수 없습니다</p>
        <p className="text-sm text-white/70 text-center max-w-md">{error}</p>
        <p className="text-xs text-white/40">{fileName}</p>
      </div>
    );
  }

  const pdf = pdfDoc;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="flex h-full bg-[#525659]">
      {showThumbnails && (
        <aside className="w-28 shrink-0 overflow-y-auto bg-[#3a3d40] border-r border-black/20 p-2 space-y-2 hidden sm:block">
          {thumbUrls.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToPage(i + 1)}
              className={`block w-full border-2 rounded overflow-hidden ${
                currentPage === i + 1 ? "border-lofice-gold" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`${i + 1}페이지`} className="w-full" />
              <span className="text-[10px] text-white/70 block text-center py-0.5">{i + 1}</span>
            </button>
          ))}
        </aside>
      )}

      <div ref={scrollRef} className="flex-1 overflow-auto overscroll-contain py-6 px-2">
        <div className="mx-auto" style={{ width: "fit-content" }}>
          {pages.map((n) => (
            <PdfPageCanvas
              key={`${n}-${scale.toFixed(3)}`}
              pdf={pdf}
              pageNumber={n}
              scale={scale}
              estimatedHeight={pageHeight}
              priority={n === 1}
              onRendered={n === 1 ? (_, h) => setPageHeight(h) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
