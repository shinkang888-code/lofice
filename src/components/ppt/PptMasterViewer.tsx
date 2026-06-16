"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft, ChevronRight, Maximize2, Minimize2, LayoutGrid, Monitor,
  StickyNote, Download,
} from "lucide-react";
import type { PptxSlide } from "@/lib/parsers/pptx";
import { useViewerToolbarOptional } from "@/components/office/ViewerToolbarContext";

type ViewMode = "normal" | "theater";

interface Props {
  slides: PptxSlide[];
  fileName: string;
  buffer?: ArrayBuffer;
}

/** PPT Master viewer.html 스타일 슬라이드 갤러리 뷰어 */
export default function PptMasterViewer({ slides, fileName, buffer }: Props) {
  const toolbar = useViewerToolbarOptional();
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("normal");
  const [showNotes, setShowNotes] = useState(false);
  const [showOverview, setShowOverview] = useState(false);

  const total = slides.length;
  const slide = slides[index];
  const progress = total > 0 ? ((index + 1) / total) * 100 : 0;

  const goTo = useCallback((i: number) => {
    setIndex(Math.min(Math.max(0, i), total - 1));
  }, [total]);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  const handleDownload = useCallback(() => {
    if (!buffer) return;
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }, [buffer, fileName]);

  useEffect(() => {
    toolbar?.register({
      docType: "presentation",
      page: index + 1,
      pageCount: total,
      zoom: 1,
      canPageNav: total > 1,
      actions: {
        prevPage: prev,
        nextPage: next,
        goToPage: (p) => goTo(p - 1),
        download: buffer ? handleDownload : undefined,
      },
    });
    return () => toolbar?.reset();
  }, [toolbar, index, total, prev, next, goTo, buffer, handleDownload]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft": prev(); break;
        case "ArrowRight": next(); break;
        case "f":
        case "F": setFullscreen((v) => !v); break;
        case "t":
        case "T": setViewMode((m) => (m === "theater" ? "normal" : "theater")); break;
        case "Escape":
          if (fullscreen) setFullscreen(false);
          else if (showOverview) setShowOverview(false);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, fullscreen, showOverview]);

  useEffect(() => {
    let startX = 0;
    const onStart = (e: TouchEvent) => { startX = e.changedTouches[0].screenX; };
    const onEnd = (e: TouchEvent) => {
      const diff = startX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else prev();
      }
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [next, prev]);

  const slideContent = (
    <div className="aspect-video bg-white shadow-2xl rounded-sm overflow-hidden flex flex-col relative w-full max-w-5xl mx-auto">
      {slide.svg ? (
        <object
          type="image/svg+xml"
          data={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(slide.svg)}`}
          className="w-full h-full min-h-[360px]"
          aria-label={slide.title}
        />
      ) : slide.imageUrls?.length ? (
        <div className="flex h-full min-h-[360px]">
          <div className="flex-1 p-6 md:p-10 flex flex-col">
            <h2 className="text-2xl md:text-3xl font-bold text-[#5b8def] mb-4 border-b border-gray-200 pb-3">
              {slide.title}
            </h2>
            <div className="flex-1 prose prose-lg max-w-none text-gray-800 overflow-auto" dangerouslySetInnerHTML={{ __html: slide.html }} />
          </div>
          <div className="hidden md:block w-2/5 p-4 bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slide.imageUrls[0]} alt="" className="w-full h-auto object-contain rounded" />
          </div>
        </div>
      ) : (
        <div className="p-8 md:p-12 flex flex-col h-full min-h-[360px]">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5b8def] mb-6 border-b border-gray-200 pb-4">
            {slide.title}
          </h2>
          <div className="flex-1 prose prose-lg max-w-none text-gray-800 overflow-auto" dangerouslySetInnerHTML={{ __html: slide.html }} />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#0d0d0f] text-[#e6e6e9]">
      {/* Progress */}
      <div className="shrink-0 h-1 bg-[#26262a]">
        <div className="h-full transition-all duration-300" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #5b8def 0%, #5b8defcc 100%)" }} />
      </div>

      {/* Toolbar */}
      <div className="shrink-0 flex items-center justify-between px-3 py-2 bg-[#16161a] border-b border-[#26262a] text-xs gap-2">
        <span className="font-medium">{index + 1} / {total}</span>
        <span className="truncate flex-1 text-center opacity-70 hidden sm:block">{fileName}</span>
        <div className="flex items-center gap-1 shrink-0">
          <ToolBtn icon={LayoutGrid} label="개요" active={showOverview} onClick={() => setShowOverview((v) => !v)} />
          <ToolBtn icon={Monitor} label="극장" active={viewMode === "theater"} onClick={() => setViewMode((m) => (m === "theater" ? "normal" : "theater"))} />
          {slide.notes && (
            <ToolBtn icon={StickyNote} label="노트" active={showNotes} onClick={() => setShowNotes((v) => !v)} />
          )}
          <ToolBtn icon={fullscreen ? Minimize2 : Maximize2} label="전체" onClick={() => setFullscreen((v) => !v)} />
          {buffer && <ToolBtn icon={Download} label="다운" onClick={handleDownload} />}
        </div>
      </div>

      <div className={`flex flex-1 min-h-0 ${viewMode === "theater" ? "" : ""}`}>
        {/* Thumbnails */}
        {viewMode === "normal" && !showOverview && (
          <aside className="hidden md:flex flex-col w-36 shrink-0 overflow-y-auto bg-[#16161a] border-r border-[#26262a] p-2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.index}
                type="button"
                onClick={() => goTo(i)}
                className={`text-left rounded border-2 p-1.5 transition-colors ${
                  i === index ? "border-[#5b8def] bg-[#5b8def]/10" : "border-transparent hover:border-[#3a3a40]"
                }`}
              >
                <span className="text-[10px] font-medium block truncate">{i + 1}. {s.title}</span>
              </button>
            ))}
          </aside>
        )}

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="flex-1 overflow-auto p-4 md:p-8 flex items-start justify-center">
            {showOverview ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl w-full">
                {slides.map((s, i) => (
                  <button
                    key={s.index}
                    type="button"
                    onClick={() => { goTo(i); setShowOverview(false); }}
                    className="glass-card rounded-lg p-3 text-left hover:border-[#5b8def]/50 border border-[#26262a] bg-[#16161a]"
                  >
                    <span className="text-[#5b8def] font-bold text-sm">{i + 1}</span>
                    <p className="font-medium text-sm mt-1 truncate">{s.title}</p>
                    {s.desc && <p className="text-[10px] text-[#8a8a93] mt-1 line-clamp-2">{s.desc}</p>}
                  </button>
                ))}
              </div>
            ) : (
              slideContent
            )}
          </div>

          {/* Nav */}
          {!showOverview && (
            <div className="shrink-0 flex items-center justify-center gap-4 py-3 bg-[#16161a] border-t border-[#26262a]">
              <button type="button" disabled={index <= 0} onClick={prev} className="nav-btn p-2 rounded-full bg-[#26262a] disabled:opacity-30 hover:bg-[#3a3a40]">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm tabular-nums">{index + 1} / {total}</span>
              <button type="button" disabled={index >= total - 1} onClick={next} className="nav-btn p-2 rounded-full bg-[#26262a] disabled:opacity-30 hover:bg-[#3a3a40]">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Speaker notes */}
        {showNotes && slide.notes && (
          <aside className="w-full md:w-72 shrink-0 border-l border-[#26262a] bg-[#16161a] p-4 overflow-y-auto">
            <h3 className="text-xs font-semibold text-[#5b8def] mb-2 flex items-center gap-1">
              <StickyNote className="w-3.5 h-3.5" /> 발표자 노트
            </h3>
            <p className="text-sm text-[#8a8a93] whitespace-pre-wrap leading-relaxed">{slide.notes}</p>
          </aside>
        )}
      </div>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-4" onClick={() => setFullscreen(false)}>
          <div className="w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            {slideContent}
            <div className="flex justify-center gap-4 mt-4 text-white/80">
              <button type="button" onClick={prev} disabled={index <= 0} className="p-2 disabled:opacity-30"><ChevronLeft /></button>
              <span>{index + 1} / {total}</span>
              <button type="button" onClick={next} disabled={index >= total - 1} className="p-2 disabled:opacity-30"><ChevronRight /></button>
            </div>
          </div>
        </div>
      )}

      <div className="shrink-0 hidden lg:flex items-center justify-center gap-4 py-1 text-[10px] text-[#8a8a93] bg-[#0d0d0f] border-t border-[#26262a]">
        <span>← → 이동</span>
        <span>T 극장</span>
        <span>F 전체화면</span>
        <span>ESC 닫기</span>
      </div>
    </div>
  );
}

function ToolBtn({
  icon: Icon, label, onClick, active,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded text-[9px] transition-colors ${
        active ? "bg-[#5b8def] text-white" : "hover:bg-[#26262a] text-[#8a8a93]"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
