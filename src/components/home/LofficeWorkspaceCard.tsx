"use client";

import { useRef, useState, useCallback, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ACCEPT_EXTENSIONS } from "@/lib/document-types";
import { openLocalDocument } from "@/lib/lofficeUi/routes";

export default function LofficeWorkspaceCard() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);

  const pick = useCallback(() => inputRef.current?.click(), []);

  const handleFile = async (file: File) => {
    setBusy(true);
    try {
      await openLocalDocument(file, router.push);
    } finally {
      setBusy(false);
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-lo-card">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workspace</p>
      <h3 className="mt-2 text-xl font-bold text-foreground">편집부터 시작</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        문서를 열고 바로 편집을 이어갑니다. 보기, 주석, 서식, 내보내기까지 한 화면에서.
      </p>
      <button
        type="button"
        onClick={pick}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        disabled={busy}
        className={`mt-5 flex h-44 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed text-sm transition ${
          dragOver
            ? "border-primary bg-primary/5 text-primary"
            : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:bg-secondary/60"
        }`}
      >
        <span className="text-3xl">☁️</span>
        <p className="mt-2">{busy ? "열는 중…" : "클릭하거나 드래그하여 업로드"}</p>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_EXTENSIONS}
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) await handleFile(file);
          e.target.value = "";
        }}
      />
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={pick}
          disabled={busy}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lo-glow transition hover:opacity-95 disabled:opacity-50"
        >
          Loffice 열기
        </button>
        <Link
          href="#doc-edit"
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary"
        >
          편집 도구 보기
        </Link>
      </div>
    </div>
  );
}
