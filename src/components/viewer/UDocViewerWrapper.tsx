"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { UDocClient, UDocViewer } from "@docmentis/udoc-viewer";
import { Loader2 } from "lucide-react";
import { useViewerToolbarOptional } from "@/components/office/ViewerToolbarContext";

interface Props {
  buffer: ArrayBuffer;
  fileName: string;
  docType?: "pdf" | "docx";
  onFallback?: () => void;
}

/** @docmentis/udoc-viewer WASM 고속 PDF/DOCX 렌더 */
export default function UDocViewerWrapper({ buffer, fileName, docType = "pdf", onFallback }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<UDocViewer | null>(null);
  const toolbar = useViewerToolbarOptional();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showThumbnails, setShowThumbnails] = useState(false);

  useEffect(() => {
    let client: UDocClient | null = null;
    let viewer: UDocViewer | null = null;
    let cancelled = false;

    async function init() {
      setLoading(true);
      setError(null);

      try {
        const { UDocClient } = await import("@docmentis/udoc-viewer");
        client = await UDocClient.create({
          baseUrl: `${window.location.origin}/udoc/`,
          locale: "ko",
        });

        if (!containerRef.current || cancelled) return;

        viewer = await client.createViewer({
          container: containerRef.current,
          hideToolbar: true,
          hideFloatingToolbar: true,
          theme: "light",
          zoomMode: "fit-spread-width",
          disableThemeSwitching: true,
        });

        viewer.on("document:load", ({ pageCount: n }) => {
          if (!cancelled) {
            setPageCount(n);
            setPage(1);
          }
        });
        viewer.on("page:change", ({ page: p }) => {
          if (!cancelled) setPage(p);
        });
        viewer.on("viewport:change", ({ zoom: z }) => {
          if (!cancelled) setZoom(z);
        });
        viewer.on("error", ({ error: err }) => {
          console.error("[UDoc]", err);
          if (!cancelled) {
            setError(err.message);
            onFallback?.();
          }
        });

        await viewer.load(new Uint8Array(buffer), { filename: fileName });
        if (cancelled) return;

        viewerRef.current = viewer;
        setPageCount(viewer.pageCount);
        setZoom(viewer.zoom);
        setPage(viewer.currentPage);
        setLoading(false);
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : "문서 로드 실패";
          setError(msg);
          onFallback?.();
        }
      }
    }

    init();
    return () => {
      cancelled = true;
      viewer?.destroy();
      client?.destroy();
      viewerRef.current = null;
    };
  }, [buffer, fileName, onFallback]);

  const handleDownload = useCallback(async () => {
    await viewerRef.current?.download(fileName);
  }, [fileName]);

  const handlePrint = useCallback(async () => {
    await viewerRef.current?.print();
  }, []);

  const zoomIn = useCallback(() => viewerRef.current?.zoomIn(), []);
  const zoomOut = useCallback(() => viewerRef.current?.zoomOut(), []);
  const zoomFit = useCallback(() => viewerRef.current?.setZoomMode("fit-spread-width"), []);
  const zoomReset = useCallback(() => viewerRef.current?.setZoom(1.25), []);
  const prevPage = useCallback(() => viewerRef.current?.previousPage(), []);
  const nextPage = useCallback(() => viewerRef.current?.nextPage(), []);
  const goToPage = useCallback((p: number) => viewerRef.current?.goToPage(p), []);
  const toggleThumbnails = useCallback(() => {
    setShowThumbnails((prev) => {
      const next = !prev;
      const v = viewerRef.current;
      if (next) v?.openPanel("thumbnail");
      else v?.closePanel();
      return next;
    });
  }, []);

  useEffect(() => {
    if (loading || !viewerRef.current) return;
    toolbar?.register({
      docType,
      page,
      pageCount,
      zoom,
      showThumbnails,
      canPageNav: pageCount > 1,
      actions: {
        zoomIn,
        zoomOut,
        zoomFit,
        zoomReset,
        prevPage,
        nextPage,
        goToPage,
        download: handleDownload,
        print: handlePrint,
        toggleThumbnails,
      },
    });
  }, [
    toolbar,
    docType,
    page,
    pageCount,
    zoom,
    showThumbnails,
    loading,
    zoomIn,
    zoomOut,
    zoomFit,
    zoomReset,
    prevPage,
    nextPage,
    goToPage,
    handleDownload,
    handlePrint,
    toggleThumbnails,
  ]);

  useEffect(() => () => toolbar?.reset(), [toolbar]);

  if (error && onFallback) return null;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 px-4 bg-[#525659] text-center">
        <p className="text-red-300 font-medium">문서를 표시할 수 없습니다</p>
        <p className="text-xs text-white/60">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-[#525659]">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-[#525659]">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <p className="text-sm text-white/80">고속 WASM 뷰어 준비 중...</p>
          <p className="text-xs text-white/50">{fileName}</p>
        </div>
      )}
      <div ref={containerRef} className="h-full w-full udoc-viewer-host" />
    </div>
  );
}
