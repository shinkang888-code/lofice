"use client";

import { Upload, Cloud } from "lucide-react";

interface Props {
  onOpen: () => void;
}

export default function PolarisOpenButton({ onOpen }: Props) {
  return (
    <>
      <button type="button" onClick={onOpen} className="polaris-open-btn group">
        <Upload className="w-6 h-6 mb-2 opacity-90 group-hover:scale-110 transition-transform" />
        <span className="text-lg font-bold">문서 열기</span>
        <span className="text-xs opacity-80 mt-1">또는 파일을 여기에 끌어다 놓으세요</span>
      </button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-white/60 mt-4">
        <Cloud className="w-3.5 h-3.5" />
        설치 없이 브라우저에서 바로 편집 · 저장
      </p>
    </>
  );
}
