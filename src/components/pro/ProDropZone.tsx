"use client";

import { useCallback, useRef, useState } from "react";
import { CloudUpload, FileText } from "lucide-react";
import { isProSupportedFile, PRO_ACCEPT } from "@/lib/pro/formats";

type Props = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
};

export default function ProDropZone({ files, onFilesChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = useCallback(
    (list: FileList | File[]) => {
      const incoming = Array.from(list).filter((f) => isProSupportedFile(f.name));
      if (!incoming.length) return;
      onFilesChange([...files, ...incoming]);
    },
    [files, onFilesChange],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (!disabled) addFiles(e.dataTransfer.files);
      }}
      onClick={() => !disabled && inputRef.current?.click()}
      className={[
        "group relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all sm:p-10",
        dragOver
          ? "border-[var(--lofice-gold)] bg-[var(--lofice-gold)]/10 scale-[1.01]"
          : "border-primary/25 bg-gradient-to-b from-primary/[0.04] to-transparent hover:border-primary/40",
        disabled ? "pointer-events-none opacity-50" : "",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={PRO_ACCEPT}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25">
        <CloudUpload className="h-7 w-7" aria-hidden />
      </div>
      <p className="font-display mt-4 text-base font-bold text-foreground sm:text-lg">
        파일을 여기에 놓거나 클릭하세요
      </p>
      <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground sm:text-sm">
        Word · Excel · PowerPoint · HWPX · OpenDocument — LibreOffice Pro 엔진으로 변환
      </p>
      {files.length > 0 && (
        <ul className="mx-auto mt-5 max-w-lg space-y-1.5 text-left">
          {files.map((f) => (
            <li
              key={`${f.name}-${f.size}`}
              className="flex items-center gap-2 rounded-lg bg-background/80 px-3 py-2 text-xs shadow-sm"
            >
              <FileText className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate font-medium">{f.name}</span>
              <span className="ml-auto shrink-0 text-muted-foreground">
                {(f.size / 1024).toFixed(0)} KB
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
