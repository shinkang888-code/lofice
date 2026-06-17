"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { CloudUpload, FolderOpen, X } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { ACCEPT_EXTENSIONS } from "@/lib/document-types";
import { getDocTypeBadge, formatBytes } from "@/lib/lofficeUi/doc-type";
import { openLocalDocument } from "@/lib/lofficeUi/routes";

export default function LofficeOpenDocumentButton() {
  const { t } = useI18n();
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
    const list = e.dataTransfer.files;
    if (list.length === 1) {
      void openFile(list[0]!);
      return;
    }
    handleFiles(list);
  };

  return (
    <div className="mx-auto w-full max-w-3xl text-left">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-center">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="group inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl bg-gold px-8 text-base font-bold text-gold-foreground shadow-md transition hover:brightness-105 active:scale-[0.98] sm:w-auto sm:rounded-full sm:px-10"
        >
          <FolderOpen className="h-5 w-5 transition group-hover:scale-110" strokeWidth={2.25} />
          <span className="whitespace-nowrap">{t("common.openDocument")}</span>
        </button>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`mt-3 cursor-pointer rounded-xl border border-dashed px-4 py-3 text-xs transition sm:text-sm ${
          dragOver
            ? "border-gold bg-gold/15 text-foreground"
            : "border-border/80 bg-card/60 text-muted-foreground hover:border-primary/30 hover:bg-card"
        }`}
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <CloudUpload className="h-4 w-4 shrink-0 opacity-70" />
          <span>{t("hero.dropHint")}</span>
          <span className="hidden text-muted-foreground/70 sm:inline">·</span>
          <span className="hidden text-[11px] text-muted-foreground/80 sm:inline">{t("hero.formats")}</span>
        </div>
      </div>

      <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <CloudUpload className="h-3 w-3" />
        {t("hero.cloudNote")}
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT_EXTENSIONS}
        className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const list = e.target.files;
          if (list?.length === 1) {
            void openFile(list[0]!);
          } else {
            handleFiles(list);
          }
          e.target.value = "";
        }}
      />

      {files.length > 0 && (
        <ul className="mt-3 space-y-1.5 rounded-xl border border-border bg-card p-2.5 shadow-lo-card">
          {files.map((f, i) => {
            const badge = getDocTypeBadge(f.name);
            const busy = opening === f.name;
            return (
              <li
                key={`${f.name}-${i}`}
                className="flex items-center gap-2.5 rounded-lg p-2 transition hover:bg-secondary/50"
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${badge.color}`}>
                  {badge.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{f.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {badge.label} · {formatBytes(f.size)}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void openFile(f)}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {busy ? t("common.opening") : t("common.open")}
                </button>
                <button
                  type="button"
                  onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="rounded-md p-1 text-muted-foreground hover:bg-secondary"
                  aria-label={t("common.remove")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
