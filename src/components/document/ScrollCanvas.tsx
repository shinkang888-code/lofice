"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface Props {
  children: ReactNode;
  className?: string;
  bgClassName?: string;
  showZoom?: boolean;
  minZoom?: number;
  maxZoom?: number;
}

export default function ScrollCanvas({
  children,
  className = "",
  bgClassName = "bg-[#c8c8c8]",
  showZoom = true,
  minZoom = 0.5,
  maxZoom = 2,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom((z) => Math.min(maxZoom, Math.max(minZoom, z + (e.deltaY < 0 ? 0.1 : -0.1))));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [minZoom, maxZoom]);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {showZoom && (
        <div className="shrink-0 flex items-center justify-end gap-1 px-2 py-1 bg-[#e8e8e8] border-b border-gray-300">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(minZoom, z - 0.1))}
            className="p-1 hover:bg-gray-200 rounded"
            title="축소"
          >
            <ZoomOut className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-xs text-gray-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(maxZoom, z + 0.1))}
            className="p-1 hover:bg-gray-200 rounded"
            title="확대"
          >
            <ZoomIn className="w-4 h-4 text-gray-600" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="p-1 hover:bg-gray-200 rounded"
            title="100%"
          >
            <Maximize2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}
      <div
        ref={containerRef}
        className={`flex-1 overflow-auto overscroll-contain ${bgClassName}`}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div
          className="inline-block min-w-full min-h-full p-4 md:p-8"
          style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
