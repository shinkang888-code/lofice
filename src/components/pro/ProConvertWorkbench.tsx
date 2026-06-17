"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Download,
  ExternalLink,
  Loader2,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import ProConnectionPanel from "./ProConnectionPanel";
import ProDropZone from "./ProDropZone";
import ProEngineStatus from "./ProEngineStatus";
import ProFormatGuide from "./ProFormatGuide";
import ProComparePanel from "./ProComparePanel";
import ProOnboarding from "./ProOnboarding";
import ProHistoryPanel from "./ProHistoryPanel";
import ProQuickActions, { type ProQuickAction } from "./ProQuickActions";
import {
  base64ToArrayBuffer,
  convertWithProEngine,
  isProApiConfigured,
} from "@/lib/pro/client";
import { appendProHistory, clearProHistory, loadProHistory } from "@/lib/pro/history";
import type { ProHistoryEntry } from "@/lib/pro/history";
import { getCommonProTargets, PRO_TARGET_LABELS } from "@/lib/pro/formats";
import type { ProConvertJob, ProEngineState, ProTargetFormat } from "@/lib/pro/types";
import { getFileLocal, saveFileLocal } from "@/lib/storage/local";
import { PRO_API_URL_CHANGED } from "@/lib/pro/settings";

export default function ProConvertWorkbench() {
  const searchParams = useSearchParams();
  const [files, setFiles] = useState<File[]>([]);
  const [target, setTarget] = useState<ProTargetFormat>("pdf");
  const [jobs, setJobs] = useState<ProConvertJob[]>([]);
  const [history, setHistory] = useState<ProHistoryEntry[]>([]);
  const [running, setRunning] = useState(false);
  const [engineState, setEngineState] = useState<ProEngineState>("offline");
  const [acceptOverride, setAcceptOverride] = useState<string | undefined>();
  const [configured, setConfigured] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const syncConfigured = useCallback(() => {
    setConfigured(isProApiConfigured());
  }, []);

  useEffect(() => {
    syncConfigured();
    setHistory(loadProHistory());
    window.addEventListener(PRO_API_URL_CHANGED, syncConfigured);
    return () => window.removeEventListener(PRO_API_URL_CHANGED, syncConfigured);
  }, [syncConfigured]);

  useEffect(() => {
    const fromId = searchParams.get("from");
    const targetParam = searchParams.get("target") as ProTargetFormat | null;
    if (targetParam && ["pdf", "docx", "xlsx", "pptx", "odt", "html"].includes(targetParam)) {
      setTarget(targetParam);
    }
    if (!fromId) return;
    void (async () => {
      const stored = await getFileLocal(fromId);
      if (!stored) return;
      setFiles([new File([stored.data], stored.name)]);
    })();
  }, [searchParams]);

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

  const handleQuickAction = useCallback((action: ProQuickAction) => {
    setTarget(action.target);
    setAcceptOverride(action.accept);
    dropRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

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
            j.id === id ? { ...j, status: "done", resultName: result.file_name, savedId } : j,
          ),
        );

        setHistory(
          appendProHistory({
            fileName: file.name,
            target,
            resultName: result.file_name,
            savedId,
          }),
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
        <div className="relative">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--lofice-gold)]">
            <Sparkles className="h-4 w-4" />
            lofice Pro
          </p>
          <h2 className="font-display mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            LibreOffice Pro 변환
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
            Pro API URL만 입력하면 레거시 Office·OpenDocument·HWPX를 고품질로 변환합니다.
            Docker 연동은 나중에 같은 URL로 연결하면 됩니다.
          </p>
        </div>
      </section>

      <ProOnboarding />
      <ProConnectionPanel onConnected={setEngineState} />
      <ProEngineStatus onStateChange={setEngineState} />

      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">빠른 작업</p>
        <ProQuickActions activeTarget={target} onSelect={handleQuickAction} />
      </div>

      <div ref={dropRef}>
        <ProDropZone
          files={files}
          onFilesChange={setFiles}
          disabled={!configured}
          acceptOverride={acceptOverride}
        />
      </div>

      {!configured && (
        <p className="text-center text-xs text-muted-foreground">
          위에서 Pro API URL을 입력하고 연결 테스트를 먼저 진행하세요.
        </p>
      )}

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-end sm:p-5">
        <label className="flex-1 text-sm">
          <span className="mb-1.5 block font-semibold text-foreground">출력 형식</span>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value as ProTargetFormat)}
            disabled={!files.length || running}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {(files.length
              ? availableTargets
              : (["pdf", "docx", "xlsx", "pptx", "odt", "html"] as ProTargetFormat[])
            ).map((t) => (
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
              setAcceptOverride(undefined);
            }}
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-border px-3 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted"
          >
            <Trash2 className="h-3.5 w-3.5" />
            초기화
          </button>
        </div>
      </div>

      {configured && engineState !== "ready" && (
        <p className="rounded-xl border border-dashed border-amber-300/50 bg-amber-50/50 px-4 py-3 text-center text-xs text-amber-900 dark:bg-amber-950/20 dark:text-amber-100">
          Pro API URL은 설정되었지만 엔진이 아직 준비되지 않았습니다. URL을 확인한 뒤「연결 테스트」를 다시 시도하세요.
        </p>
      )}

      {engineState === "offline" && !configured && (
        <p className="rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30 px-4 py-3 text-center text-xs text-muted-foreground">
          Pro 없이도{" "}
          <Link href="/convert/" className="font-semibold text-primary underline-offset-2 hover:underline">
            브라우저 문서 변환
          </Link>
          을 사용할 수 있습니다.
        </p>
      )}

      {jobs.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <h3 className="font-display text-sm font-bold text-foreground">이번 작업 결과</h3>
          <ul className="mt-3 space-y-2">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="flex flex-wrap items-center gap-2 rounded-xl bg-muted/40 px-3 py-2.5 text-xs sm:text-sm"
              >
                <span className="min-w-0 flex-1 truncate font-medium">{job.fileName}</span>
                <span className="text-muted-foreground">→ {PRO_TARGET_LABELS[job.target]}</span>
                {job.status === "running" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
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

      <ProHistoryPanel
        entries={history}
        onClear={() => {
          clearProHistory();
          setHistory([]);
        }}
      />

      <ProFormatGuide />
      <ProComparePanel />
    </div>
  );
}
