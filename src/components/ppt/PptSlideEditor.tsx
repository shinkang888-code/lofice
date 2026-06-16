"use client";

import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Save, Download } from "lucide-react";
import type { PptxSlide } from "@/lib/parsers/pptx";

interface Props {
  initialSlides: PptxSlide[];
  fileName: string;
  onSave?: (buffer: ArrayBuffer, slides: PptxSlide[]) => Promise<void>;
}

/** PPT Master 스타일 슬라이드 편집기 — 제목·본문·발표자 노트 */
export default function PptSlideEditor({ initialSlides, fileName, onSave }: Props) {
  const [slides, setSlides] = useState<PptxSlide[]>(() => initialSlides.map((s) => ({ ...s })));
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);

  const slide = slides[index];

  const updateSlide = useCallback((patch: Partial<PptxSlide>) => {
    setSlides((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }, [index]);

  const addSlide = () => {
    const n = slides.length + 1;
    setSlides((prev) => [...prev, { index: n, title: `슬라이드 ${n}`, html: "<p>새 슬라이드</p>" }]);
    setIndex(slides.length);
  };

  const deleteSlide = () => {
    if (slides.length <= 1) return;
    setSlides((prev) => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, index: i + 1 })));
    setIndex((i) => Math.max(0, i - 1));
  };

  const handleExport = async () => {
    setBusy(true);
    try {
      const { exportSlidesToPptx, downloadPptx } = await import("@/lib/ppt/pptx-export");
      const buf = await exportSlidesToPptx(slides, fileName);
      if (onSave) await onSave(buf, slides);
      else downloadPptx(buf, fileName);
    } finally {
      setBusy(false);
    }
  };

  if (!slide) return null;

  return (
    <div className="flex h-full bg-[#0d0d0f] text-[#e6e6e9]">
      <aside className="w-40 shrink-0 border-r border-[#26262a] bg-[#16161a] overflow-y-auto p-2 space-y-1">
        {slides.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`w-full text-left text-xs p-2 rounded truncate ${
              i === index ? "bg-[#5b8def]/20 border border-[#5b8def]" : "hover:bg-[#26262a]"
            }`}
          >
            {i + 1}. {s.title}
          </button>
        ))}
        <button type="button" onClick={addSlide} className="w-full flex items-center justify-center gap-1 py-2 text-[10px] text-[#5b8def] hover:bg-[#26262a] rounded">
          <Plus className="w-3 h-3" /> 슬라이드 추가
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="shrink-0 flex items-center gap-2 px-3 py-2 border-b border-[#26262a] bg-[#16161a]">
          <button type="button" disabled={index <= 0} onClick={() => setIndex((i) => i - 1)} className="p-1 disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs flex-1 text-center">{index + 1} / {slides.length}</span>
          <button type="button" disabled={index >= slides.length - 1} onClick={() => setIndex((i) => i + 1)} className="p-1 disabled:opacity-30">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button type="button" onClick={deleteSlide} disabled={slides.length <= 1} className="p-1.5 text-red-400 disabled:opacity-30" title="슬라이드 삭제">
            <Trash2 className="w-4 h-4" />
          </button>
          <button type="button" onClick={handleExport} disabled={busy} className="flex items-center gap-1 px-3 py-1 bg-[#5b8def] rounded text-xs font-medium disabled:opacity-50">
            {onSave ? <Save className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            {busy ? "저장 중..." : onSave ? "저장" : "PPTX 다운로드"}
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            <label className="block">
              <span className="text-xs text-[#8a8a93] mb-1 block">슬라이드 제목</span>
              <input
                type="text"
                value={slide.title}
                onChange={(e) => updateSlide({ title: e.target.value })}
                className="w-full bg-[#16161a] border border-[#26262a] rounded px-3 py-2 text-lg font-bold text-[#5b8def]"
              />
            </label>
            <label className="block">
              <span className="text-xs text-[#8a8a93] mb-1 block">본문 (HTML)</span>
              <textarea
                value={slide.html.replace(/<[^>]+>/g, (m) => m === "<p>" || m === "</p>" || m.includes("class") ? m : "")}
                onChange={(e) => {
                  const lines = e.target.value.split("\n").filter(Boolean);
                  updateSlide({
                    html: lines.length
                      ? lines.map((l) => `<p class="mb-3 text-lg">${l}</p>`).join("")
                      : "<p></p>",
                  });
                }}
                rows={8}
                className="w-full bg-[#16161a] border border-[#26262a] rounded px-3 py-2 text-sm font-mono"
              />
            </label>
            <label className="block">
              <span className="text-xs text-[#8a8a93] mb-1 block">발표자 노트 (PPT Master narration)</span>
              <textarea
                value={slide.notes ?? ""}
                onChange={(e) => updateSlide({ notes: e.target.value || undefined })}
                rows={4}
                placeholder="슬라이드 내레이션 / 스피커 노트"
                className="w-full bg-[#16161a] border border-[#26262a] rounded px-3 py-2 text-sm"
              />
            </label>

            <div className="aspect-video bg-white rounded shadow-lg p-8 overflow-auto">
              <h2 className="text-2xl font-bold text-[#5b8def] mb-4 border-b pb-2">{slide.title}</h2>
              <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: slide.html }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
