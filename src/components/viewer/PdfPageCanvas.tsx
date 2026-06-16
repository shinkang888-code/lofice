"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
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
  const [visible, setVisible] = useState(priority);
  const [rendered, setRendered] = useState(false);
  const [error, setError] = useState(false);

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

  useEffect(() => {
    if (!visible || rendered || error) return;
    let cancelled = false;
    let page: PDFPageProxy | null = null;

    async function renderPage() {
      try {
        page = await pdf.getPage(pageNumber);
        if (cancelled) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        await page.render({ canvasContext: ctx, viewport }).promise;

        if (!cancelled) {
          setRendered(true);
          onRendered?.(pageNumber, viewport.height);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }

    renderPage();
    return () => {
      cancelled = true;
      page?.cleanup();
    };
  }, [visible, rendered, error, pdf, pageNumber, scale, onRendered]);

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
        <div className="flex items-center justify-center bg-red-50 text-red-500 text-sm p-8" style={{ minHeight: 120 }}>
          {pageNumber}페이지 렌더링 실패
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`block ${rendered ? "" : "absolute opacity-0 pointer-events-none"}`}
      />
    </div>
  );
}
