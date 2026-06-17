"use client";

import { useRef, useState, useCallback, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CloudUpload, FolderOpen, Upload } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { ACCEPT_EXTENSIONS } from "@/lib/document-types";
import { openLocalDocument } from "@/lib/lofficeUi/routes";

export default function LofficeWorkspaceCard() {
  const { t } = useI18n();
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
    if (file) void handleFile(file);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-lo-card transition hover:border-primary/25 hover:shadow-lo-glow sm:p-6">
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 transition group-hover:bg-primary/10" />
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{t("workspace.label")}</p>
      <h3 className="mt-1.5 text-lg font-bold tracking-tight text-foreground sm:text-xl">{t("workspace.title")}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t("workspace.desc")}</p>
      <button
        type="button"
        onClick={pick}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        disabled={busy}
        className={`mt-4 flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-sm transition sm:h-36 ${
          dragOver
            ? "border-primary bg-primary/5 text-primary"
            : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/35 hover:bg-secondary/50"
        }`}
      >
        <CloudUpload className="h-7 w-7 opacity-80" strokeWidth={1.5} />
        <p className="font-medium">{busy ? t("workspace.uploading") : t("workspace.upload")}</p>
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
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={pick}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 disabled:opacity-50"
        >
          <FolderOpen className="h-4 w-4" />
          {t("workspace.openLoffice")}
        </button>
        <Link
          href="/doc-edit/"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-secondary"
        >
          <Upload className="h-4 w-4 opacity-70" />
          {t("workspace.viewTools")}
        </Link>
      </div>
    </div>
  );
}
