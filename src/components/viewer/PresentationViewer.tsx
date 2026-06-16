"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ScrollCanvas from "@/components/document/ScrollCanvas";
import type { PptxSlide } from "@/lib/parsers/pptx";

interface Props {
  slides: PptxSlide[];
  fileName: string;
}

export default function PresentationViewer({ slides, fileName }: Props) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const total = slides.length;

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      <div className="shrink-0 flex items-center justify-between px-4 py-2 bg-[#2b579a] text-white text-xs">
        <span>슬라이드 {index + 1} / {total}</span>
        <span className="truncate mx-4 opacity-80">{fileName}</span>
        <div className="flex gap-1">
          <button
            type="button"
            disabled={index <= 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={index >= total - 1}
            onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
            className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ScrollCanvas showZoom bgClassName="bg-[#404040]" minZoom={0.4} maxZoom={2.5}>
        <div className="mx-auto w-full max-w-4xl">
          <div className="aspect-video bg-white shadow-2xl rounded-sm p-8 md:p-12 flex flex-col">
            <h2 className="text-2xl md:text-3xl font-bold text-[#2b579a] mb-6 border-b border-gray-200 pb-4">
              {slide.title}
            </h2>
            <div
              className="flex-1 prose prose-lg max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: slide.html }}
            />
          </div>
        </div>
      </ScrollCanvas>

      <div className="shrink-0 flex gap-1 overflow-x-auto px-2 py-2 bg-[#2d2d2d]">
        {slides.map((s, i) => (
          <button
            key={s.index}
            type="button"
            onClick={() => setIndex(i)}
            className={`shrink-0 w-20 h-12 rounded border-2 text-[9px] p-1 truncate ${
              i === index ? "border-lofice-gold bg-white text-gray-800" : "border-gray-600 text-gray-400"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>
    </div>
  );
}
