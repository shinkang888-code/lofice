"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ZoomIn, ZoomOut, Maximize2, Shrink } from "lucide-react";

interface Props {
  url: string;
  fileName: string;
  mimeType?: string;
}

export default function ImageViewer({ url, fileName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [fitScale, setFitScale] = useState(1);
  const [userZoom, setUserZoom] = useState(1);

  const computeFit = useCallback(() => {
    const el = containerRef.current;
    if (!el || natural.w === 0 || natural.h === 0) return;
    const pad = 24;
    const cw = Math.max(el.clientWidth - pad, 1);
    const ch = Math.max(el.clientHeight - pad, 1);
    setFitScale(Math.min(cw / natural.w, ch / natural.h, 1));
  }, [natural]);

  useEffect(() => {
    computeFit();
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(computeFit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [computeFit]);

  const totalScale = fitScale * userZoom;
  const displayW = natural.w > 0 ? Math.round(natural.w * totalScale) : undefined;
  const displayH = natural.h > 0 ? Math.round(natural.h * totalScale) : undefined;

  const fitToScreen = () => {
    setUserZoom(1);
    computeFit();
  };

  const showActualSize = () => {
    if (fitScale > 0) setUserZoom(1 / fitScale);
  };

  return (
    <div className="flex flex-col h-full bg-[#2a2a2a]">
      <div className="shrink-0 flex items-center justify-end gap-1 px-2 py-1 bg-[#e8e8e8] border-b border-gray-300">
        <button
          type="button"
          onClick={() => setUserZoom((z) => Math.max(0.25, z - 0.25))}
          className="p-1 hover:bg-gray-200 rounded"
          title="축소"
        >
          <ZoomOut className="w-4 h-4 text-gray-600" />
        </button>
        <span className="text-xs text-gray-500 w-12 text-center">
          {Math.round(totalScale * 100)}%
        </span>
        <button
          type="button"
          onClick={() => setUserZoom((z) => Math.min(4, z + 0.25))}
          className="p-1 hover:bg-gray-200 rounded"
          title="확대"
        >
          <ZoomIn className="w-4 h-4 text-gray-600" />
        </button>
        <button
          type="button"
          onClick={fitToScreen}
          className="p-1 hover:bg-gray-200 rounded"
          title="화면에 맞춤"
        >
          <Shrink className="w-4 h-4 text-gray-600" />
        </button>
        <button
          type="button"
          onClick={showActualSize}
          className="p-1 hover:bg-gray-200 rounded"
          title="원본 크기"
        >
          <Maximize2 className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-auto flex items-center justify-center p-3 min-h-0"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <img
          src={url}
          alt={fileName}
          draggable={false}
          onLoad={(e) => {
            const img = e.currentTarget;
            setNatural({ w: img.naturalWidth, h: img.naturalHeight });
          }}
          className="shadow-2xl select-none object-contain"
          style={
            displayW && displayH
              ? { width: displayW, height: displayH }
              : { maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto" }
          }
        />
      </div>

      <div className="shrink-0 px-4 py-1.5 bg-[#f0f0f0] border-t border-gray-300 text-xs text-gray-500 flex justify-between gap-2">
        <span className="shrink-0">이미지</span>
        <span className="truncate text-right">
          {fileName}
          {natural.w > 0 ? ` · ${natural.w}×${natural.h}` : ""}
        </span>
      </div>
    </div>
  );
}
