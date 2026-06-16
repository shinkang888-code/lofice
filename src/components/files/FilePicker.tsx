"use client";

import { useRef } from "react";
import { Upload, FileText, Table, File } from "lucide-react";

interface Props {
  onFileSelect: (file: File) => void;
}

const ACCEPT = ".hwpx,.hwp,.docx,.doc,.xlsx,.xls,.csv,.pdf,.txt";

export default function FilePicker({ onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="file-picker">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
          e.target.value = "";
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full flex flex-col items-center gap-4 p-8 border-2 border-dashed border-brand-300 rounded-2xl bg-brand-50 hover:bg-brand-100 transition-colors"
      >
        <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center">
          <Upload className="w-8 h-8 text-white" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-800">문서 열기</p>
          <p className="text-sm text-gray-500 mt-1">탭하여 파일을 선택하세요</p>
        </div>
        <div className="flex gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> HWPX/DOCX</span>
          <span className="flex items-center gap-1"><Table className="w-3 h-3" /> XLSX</span>
          <span className="flex items-center gap-1"><File className="w-3 h-3" /> PDF</span>
        </div>
      </button>
    </div>
  );
}
