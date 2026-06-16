"use client";

import { useEffect, useRef, useState } from "react";
import type { HwpDocument } from "@rhwp/core";

interface Props {
  doc: HwpDocument;
  pageIndex: number;
  scale: number;
  width: number;
  height: number;
  priority?: boolean;
}

export default function RhwpPageCanvas({ doc, pageIndex, scale, width, height, priority }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    function render() {
      const c = canvasRef.current;
      if (cancelled || !c) return;
      try {
        doc.renderPageToCanvas(pageIndex, c, scale);
        setRendered(true);
      } catch (e) {
        console.error(`[RhwpPageCanvas] page ${pageIndex}`, e);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (cancelled) return;
        if (entries.some((e) => e.isIntersecting) || priority) render();
      },
      { rootMargin: "200px" },
    );
    observer.observe(canvas);
    if (priority) render();

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [doc, pageIndex, scale, priority]);

  useEffect(() => {
    setRendered(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView || priority) {
      try {
        doc.renderPageToCanvas(pageIndex, canvas, scale);
        setRendered(true);
      } catch { /* retry on scroll */ }
    }
  }, [doc, pageIndex, scale, priority]);

  const displayW = Math.max(1, Math.floor(width * scale));
  const displayH = Math.max(1, Math.floor(height * scale));

  return (
    <div
      data-page={pageIndex + 1}
      className="mb-6 shadow-lg bg-white mx-auto"
      style={{ width: displayW, minHeight: displayH }}
    >
      <canvas
        ref={canvasRef}
        width={displayW}
        height={displayH}
        className="block w-full h-auto"
        style={{ width: displayW, height: displayH }}
      />
    </div>
  );
}
