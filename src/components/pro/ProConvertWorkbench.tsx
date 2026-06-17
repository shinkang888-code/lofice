"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Download,
  ExternalLink,
  Loader2,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import ProDropZone from "./ProDropZone";
import ProEngineStatus from "./ProEngineStatus";
import {
  base64ToArrayBuffer,
  convertWithProEngine,
  isProApiConfigured,
} from "@/lib/pro/client";
import {
  getCommonProTargets,
  PRO_TARGET_LABELS,
} from "@/lib/pro/formats";
import type { ProConvertJob, ProEngineState, ProTargetFormat } from "@/lib/pro/types";
import { saveFileLocal } from "@/lib/storage/local";

export default function ProConvertWorkbench() {
  const [files, setFiles] = useState<File[]>([]);
  const [target, setTarget] = useState<ProTargetFormat>("pdf");
  const [jobs, setJobs] = useState<ProConvertJob[]>([]);
  const [running, setRunning] = useState(false);
  const [engineState, setEngineState] = useState<ProEngineState>("offline");

  const configured = isProApiConfigured();
  const canConvert = configured && engineState === "ready" && files.length > 0 && !running;

  const availableTargets = useMemo(
    () => getCommonProTargets(files.map((f) => f.name)),
    [files],
  );

  useEffect(() => {
    if (!availableTargets.includes(target)) {
      setTarget(availableTargets[0] ?? "pdf");
    }
  }, [availableTargets, target]);

  const runConvert = useCallback(async () => {
    if (engineState !== "ready" || !files.length || running) return;
    setRunning(true);

    for (const file of files) {
      const id = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setJobs((prev) => [...prev, { id, fileName: file.name, target, status: "running" }]);

      try {
        const buffer = await file.arrayBuffer();
        const result = await convertWithProEngine(buffer, file.name, target);
        const outBuffer = base64ToArrayBuffer(result.data_base64);
        const outFile = new File([outBuffer], result.file_name);
        const savedId = await saveFileLocal(outFile);

        setJobs((prev) =>
          prev.map((j) =>
            j.id === id
              ? { ...j, status: "done", resultName: result.file_name, savedId }
              : j,
          ),
        );
      } catch (e) {
        const message = e instanceof Error ? e.message : "변환 실패";
        setJobs((prev) =>
          prev.map((j) => (j.id === id ? { ...j, status: "error", error: message } : j)),
        );
      }
    }

    setRunning(false);
  }, [engineState, files, running, target]);

  const downloadJob = useCallback(async (job: ProConvertJob) => {
    if (!job.savedId || !job.resultName) return;
    const { getFileLocal } = await import("@/lib/storage/local");
    const stored = await getFileLocal(job.savedId);
    if (!stored) return;
    const blob = new Blob([stored.data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = job.resultName;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary via-[#0a4a8c] to-[#062a52] p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[var(--lofice-gold)]/20 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--lofice-gold)]">
              <Sparkles className="h-4 w-4" />
              lofice Pro
            </p>
            <h2 className="font-display mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              LibreOffice Pro 변환
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
              레거시 Office·OpenDocument·HWPX를 서버 LibreOffice 엔진으로 정확하게 변환합니다.
              브라우저 기본 변환보다 호환성이 높습니다.
            </p>
          </div>
          {!configured && (
            <p className="rounded-xl bg-white/10 px-3 py-2 text-xs backdrop-blur">
              `.env.local`에 NEXT_PUBLIC_OFFICE_CONVERT_URL 설정 필요
            </p>
          )}
        </div>
      </section>

      <ProEngineStatus onStateChange={(s) => setEngineState(s)} />

      <ProDropZone
        files={files}
        onFilesChange={setFiles}
        disabled={!configured || engineState !== "ready"}
      />

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-end sm:p-5">
        <label className="flex-1 text-sm">
          <span className="mb-1.5 block font-semibold text-foreground">출력 형식</span>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value as ProTargetFormat)}
            disabled={!files.length || running}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {availableTargets.map((t) => (
              <option key={t} value={t}>
                {PRO_TARGET_LABELS[t]}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-2 sm:shrink-0">
          <button
            type="button"
            disabled={!canConvert}
            onClick={() => void runConvert()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            {running ? "변환 중…" : "Pro 변환 시작"}
          </button>
          <button
            type="button"
            onClick={() => {
              setFiles([]);
              setJobs([]);
            }}
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-border px-3 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted"
          >
            <Trash2 className="h-3.5 w-3.5" />
            초기화
          </button>
        </div>
      </div>

      {engineState === "offline" && (
        <p className="rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30 px-4 py-3 text-center text-xs text-muted-foreground">
          Pro 엔진 없이도{" "}
          <Link href="/convert/" className="font-semibold text-primary underline-offset-2 hover:underline">
            브라우저 문서 변환
          </Link>
          을 사용할 수 있습니다.
        </p>
      )}

      {jobs.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <h3 className="font-display text-sm font-bold text-foreground">작업 결과</h3>
          <ul className="mt-3 space-y-2">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="flex flex-wrap items-center gap-2 rounded-xl bg-muted/40 px-3 py-2.5 text-xs sm:text-sm"
              >
                <span className="min-w-0 flex-1 truncate font-medium">{job.fileName}</span>
                <span className="text-muted-foreground">→ {PRO_TARGET_LABELS[job.target]}</span>
                {job.status === "running" && (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                )}
                {job.status === "done" && job.resultName && (
                  <>
                    <span className="text-emerald-600 dark:text-emerald-400">{job.resultName}</span>
                    <button
                      type="button"
                      onClick={() => void downloadJob(job)}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary hover:bg-primary/20"
                    >
                      <Download className="h-3 w-3" />
                      다운로드
                    </button>
                    {job.savedId && (
                      <Link
                        href={`/viewer/?id=${encodeURIComponent(job.savedId)}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-primary/20 px-2 py-1 text-[10px] font-semibold text-primary hover:bg-primary/5"
                      >
                        <ExternalLink className="h-3 w-3" />
                        뷰어
                      </Link>
                    )}
                  </>
                )}
                {job.status === "error" && (
                  <span className="text-red-600 dark:text-red-400">{job.error}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
