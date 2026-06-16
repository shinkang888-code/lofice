"use client";

import { useRef, useState, useCallback, type DragEvent } from "react";
import { Upload, FileText, Table, File, ImageIcon } from "lucide-react";
import { ACCEPT_EXTENSIONS, isSupportedFile } from "@/lib/document-types";

interface Props {
  onFileSelect: (file: File) => void;
}

export default function FilePicker({ onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragCounter = useRef(0);

  const pickFile = useCallback(
    (file: File | null | undefined) => {
      if (!file) return;
      if (!isSupportedFile(file)) {
        alert(`지원하지 않는 형식입니다.\n\n지원: ${ACCEPT_EXTENSIONS.replace(/\./g, " ").trim()}`);
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const onDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    setDragging(true);
  };

  const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setDragging(false);
    }
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    pickFile(file);
  };

  return (
    <div
      className="file-picker"
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_EXTENSIONS}
        className="hidden"
        onChange={(e) => {
          pickFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`w-full flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-2xl transition-all ${
          dragging
            ? "border-lofice-gold bg-lofice-gold/15 scale-[1.02] shadow-lg"
            : "border-lofice-navy/30 bg-lofice-navy/5 hover:bg-lofice-navy/10"
        }`}
      >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md transition-colors ${
          dragging ? "bg-lofice-gold" : "bg-lofice-navy"
        }`}>
          <Upload className={`w-8 h-8 ${dragging ? "text-lofice-navy" : "text-lofice-gold"}`} />
        </div>
        <div className="text-center">
          <p className="font-semibold text-lofice-navy">
            {dragging ? "여기에 놓으세요" : "문서 열기"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {dragging ? "파일을 놓으면 바로 열립니다" : "탭하거나 파일을 끌어다 놓으세요"}
          </p>
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
