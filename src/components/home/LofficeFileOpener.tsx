"use client";

import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { ACCEPT_EXTENSIONS } from "@/lib/document-types";
import { getDocTypeBadge, formatBytes } from "@/lib/lofficeUi/doc-type";
import { openLocalDocument } from "@/lib/lofficeUi/routes";

export default function LofficeFileOpener() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [opening, setOpening] = useState<string | null>(null);

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((prev) => [...Array.from(list), ...prev].slice(0, 8));
  };

  const openFile = async (file: File) => {
    setOpening(file.name);
    try {
      await openLocalDocument(file, router.push);
    } finally {
      setOpening(null);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="mx-auto mt-8 max-w-2xl">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition ${
          dragOver
            ? "border-[color:var(--gold)] bg-[color:var(--gold)]/10"
            : "border-white/40 bg-white/10 backdrop-blur"
        }`}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-2xl text-white">
          ↑
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 rounded-full bg-[color:var(--gold)] px-7 py-3 text-base font-bold text-[color:var(--gold-foreground)] shadow-lg transition hover:brightness-105"
        >
          문서 열기
        </button>
        <p className="mt-3 text-sm text-white/85">또는 파일을 여기에 끌어다 놓으세요</p>
        <p className="mt-1 text-xs text-white/65">HWP · DOCX · XLSX · PPTX · PDF · ZIP · 7Z</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_EXTENSIONS}
          className="hidden"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/80">
        <span>☁️</span> 설치 없이 브라우저에서 바로 편집 · 저장
      </p>

      {files.length > 0 && (
        <ul className="mt-5 space-y-2 rounded-xl border border-border bg-card p-3 text-left shadow-lo-card">
          {files.map((f, i) => {
            const t = getDocTypeBadge(f.name);
            const busy = opening === f.name;
            return (
              <li key={`${f.name}-${i}`} className="flex items-center gap-3 rounded-lg p-2 hover:bg-secondary/60">
                <span className={`flex h-9 w-9 items-center justify-center rounded-md text-white ${t.color}`}>
                  {t.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-card-foreground">{f.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.label} · {formatBytes(f.size)}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => openFile(f)}
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {busy ? "열는 중…" : "열기"}
                </button>
                <button
                  type="button"
                  onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-secondary"
                  aria-label="제거"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
