"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { Loader2 } from "lucide-react";

interface Props {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  scale: number;
  estimatedHeight?: number;
  onRendered?: (pageNumber: number, height: number) => void;
  priority?: boolean;
}

export default function PdfPageCanvas({
  pdf,
  pageNumber,
  scale,
  estimatedHeight = 800,
  onRendered,
  priority = false,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onRenderedRef = useRef(onRendered);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const [visible, setVisible] = useState(priority);
  const [rendered, setRendered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onRenderedRef.current = onRendered;
  }, [onRendered]);

  useEffect(() => {
    if (priority) return;
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px", threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [priority]);

  // scale 변경 시 재렌더
  useEffect(() => {
    setRendered(false);
    setError(null);
  }, [scale, pageNumber, pdf]);

  useEffect(() => {
    if (!visible || rendered || error) return;

    let cancelled = false;

    async function renderPage() {
      try {
        const page = await pdf.getPage(pageNumber);
        if (cancelled) {
          page.cleanup();
          return;
        }

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) {
          page.cleanup();
          return;
        }

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) {
          page.cleanup();
          if (!cancelled) setError("캔버스를 초기화하지 못했습니다.");
          return;
        }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const transform = dpr !== 1 ? ([dpr, 0, 0, dpr, 0, 0] as const) : undefined;
        const task = page.render({
          canvasContext: ctx,
          viewport,
          ...(transform ? { transform: [...transform] } : {}),
        });
        renderTaskRef.current = task;

        await task.promise;

        if (!cancelled) {
          setRendered(true);
          onRenderedRef.current?.(pageNumber, viewport.height);
        }
        page.cleanup();
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : "알 수 없는 오류";
          console.error(`PDF page ${pageNumber} render failed:`, e);
          setError(msg);
        }
      } finally {
        renderTaskRef.current = null;
      }
    }

    renderPage();
    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
    };
  }, [visible, rendered, error, pdf, pageNumber, scale]);

  return (
    <div
      ref={rootRef}
      className="relative mx-auto mb-4 bg-white shadow-lg"
      style={{ minHeight: rendered ? undefined : estimatedHeight, width: "fit-content" }}
      data-page={pageNumber}
    >
      {!rendered && !error && (
        <div
          className="flex items-center justify-center bg-white text-gray-400"
          style={{ minHeight: estimatedHeight, minWidth: 280 }}
        >
          <Loader2 className="w-6 h-6 animate-spin text-lofice-navy/50" />
        </div>
      )}
      {error && (
        <div
          className="flex flex-col items-center justify-center bg-red-50 text-red-500 text-sm p-8 gap-1"
          style={{ minHeight: 120, minWidth: 280 }}
        >
          <span>{pageNumber}페이지 렌더링 실패</span>
          <span className="text-[10px] text-red-400 max-w-xs text-center">{error}</span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`block ${rendered ? "" : "absolute opacity-0 pointer-events-none inset-0"}`}
      />
    </div>
  );
}
