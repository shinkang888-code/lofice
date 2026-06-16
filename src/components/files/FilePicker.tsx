"use client";

import { useRef } from "react";
import { Upload, FileText, Table, File, ImageIcon } from "lucide-react";
import { ACCEPT_EXTENSIONS } from "@/lib/document-types";

interface Props {
  onFileSelect: (file: File) => void;
}

export default function FilePicker({ onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="file-picker">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_EXTENSIONS}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
          e.target.value = "";
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full flex flex-col items-center gap-4 p-8 border-2 border-dashed border-lawbox-navy/30 rounded-2xl bg-lawbox-navy/5 hover:bg-lawbox-navy/10 transition-colors"
      >
        <div className="w-16 h-16 bg-lawbox-navy rounded-2xl flex items-center justify-center shadow-md">
          <Upload className="w-8 h-8 text-lawbox-gold" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-lawbox-navy">문서 열기</p>
          <p className="text-sm text-gray-500 mt-1">탭하여 파일을 선택하세요</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> HWP/DOCX</span>
          <span className="flex items-center gap-1"><Table className="w-3 h-3" /> XLSX</span>
          <span className="flex items-center gap-1"><File className="w-3 h-3" /> PDF/MD</span>
          <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> 이미지</span>
        </div>
      </button>
    </div>
  );
}
