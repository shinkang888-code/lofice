"use client";

import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { CloudUpload, FolderOpen, Search, X } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { ACCEPT_EXTENSIONS } from "@/lib/document-types";
import { getDocTypeBadge, formatBytes } from "@/lib/lofficeUi/doc-type";
import { openLocalDocument } from "@/lib/lofficeUi/routes";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  resultCount?: number;
  variant?: "default" | "polaris";
};

export default function LofficeHeroSearch({ search, onSearchChange, resultCount, variant = "default" }: Props) {
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

  const isPolaris = variant === "polaris";

  return (
    <div className={`mx-auto w-full text-left ${isPolaris ? "max-w-3xl" : "max-w-3xl"}`}>
      {!isPolaris && (
        <label htmlFor="lo-search" className="mb-1.5 block text-xs font-medium text-muted-foreground sm:text-sm">
          {t("hero.searchLabel")}
        </label>
      )}

      {isPolaris ? (
        <div className="lo-mobile-search-pill lo-polaris-pill flex flex-col overflow-hidden rounded-2xl bg-card sm:rounded-full sm:flex-row sm:items-stretch">
          <div className="flex min-h-[52px] flex-1 items-center gap-3 px-4 sm:border-b-0 sm:border-r sm:px-5">
            <Search className="h-[18px] w-[18px] shrink-0 text-muted-foreground" strokeWidth={2} />
            <input
              id="lo-search"
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t("hero.searchPlaceholder")}
              className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/70 sm:text-base"
            />
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="group inline-flex min-h-[52px] shrink-0 items-center justify-center gap-2 bg-gold px-6 text-base font-bold text-gold-foreground transition active:brightness-95 sm:min-h-[52px] sm:px-8"
          >
            <FolderOpen className="h-5 w-5" strokeWidth={2.25} />
            <span className="whitespace-nowrap">{t("common.openDocument")}</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <div className="flex min-h-[48px] flex-1 items-center gap-2.5 rounded-xl border border-border/80 bg-card/90 px-3.5 shadow-lo-card backdrop-blur-sm transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-ring/30 sm:px-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2} />
            <input
              id="lo-search"
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t("hero.searchPlaceholder")}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
            />
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-gold px-5 text-sm font-bold text-gold-foreground shadow-md transition hover:brightness-105 hover:shadow-lg active:scale-[0.98] sm:h-auto sm:px-6 sm:text-base"
          >
            <FolderOpen className="h-4 w-4 transition group-hover:scale-110" strokeWidth={2.25} />
            <span className="whitespace-nowrap">{t("common.openDocument")}</span>
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="lo-mobile-open-card mt-3 w-full sm:hidden"
      >
        <FolderOpen className="h-5 w-5 text-primary" />
        <span className="font-semibold">{t("common.openDocument")}</span>
        <span className="text-xs text-muted-foreground">{t("hero.formats")}</span>
      </button>

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
        className={`${isPolaris ? "mt-3" : "mt-2.5"} hidden cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-2.5 text-xs transition sm:flex sm:text-sm ${
          dragOver
            ? "border-gold bg-gold/15 text-foreground"
            : "border-border/80 bg-card/60 text-muted-foreground hover:border-primary/30 hover:bg-card"
        }`}
      >
        <CloudUpload className="h-4 w-4 shrink-0 opacity-70" />
        <span>{t("hero.dropHint")}</span>
        <span className="hidden text-muted-foreground/70 sm:inline">·</span>
        <span className="hidden text-[11px] text-muted-foreground/80 sm:inline">{t("hero.formats")}</span>
      </div>

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

      {search.trim() && resultCount === 0 && (
        <p className="mt-2 text-xs text-muted-foreground">{t("hero.noResults")}</p>
      )}

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
