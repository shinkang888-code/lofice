"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Link2, Loader2, Plug, Trash2 } from "lucide-react";
import { resolveEngineState } from "@/lib/pro/client";
import {
  normalizeProApiUrl,
  PRO_API_PRESETS,
  PRO_API_URL_CHANGED,
} from "@/lib/pro/settings";
import { useProApiUrl } from "@/lib/pro/useProApiUrl";
import type { ProEngineState } from "@/lib/pro/types";

type Props = {
  onConnected?: (state: ProEngineState) => void;
};

export default function ProConnectionPanel({ onConnected }: Props) {
  const { url, source, save } = useProApiUrl();
  const [draft, setDraft] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    setDraft(url ?? "");
  }, [url]);

  const runTest = useCallback(async (targetUrl?: string) => {
    const normalized = normalizeProApiUrl(targetUrl ?? draft);
    if (!normalized) {
      setTestResult({ ok: false, message: "올바른 http(s) URL을 입력하세요." });
      return;
    }
    setTesting(true);
    setTestResult(null);
    save(normalized);
    try {
      const res = await fetch(`${normalized}/health`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const health = await res.json();
      const state = resolveEngineState(health);
      onConnected?.(state);
      if (state === "ready") {
        setTestResult({ ok: true, message: "LibreOffice Pro 엔진 연결 성공" });
      } else if (state === "degraded") {
        setTestResult({ ok: false, message: "API는 응답하지만 LibreOffice가 없습니다. Pro 서버를 확인하세요." });
      } else {
        setTestResult({ ok: false, message: "엔진 상태를 확인할 수 없습니다." });
      }
    } catch {
      setTestResult({ ok: false, message: "연결 실패 — URL·서버 상태를 확인하세요." });
      onConnected?.("offline");
    }
    setTesting(false);
  }, [draft, onConnected, save]);

  useEffect(() => {
    const handler = () => void runTest(url ?? undefined);
    window.addEventListener(PRO_API_URL_CHANGED, handler);
    return () => window.removeEventListener(PRO_API_URL_CHANGED, handler);
  }, [runTest, url]);

  const sourceLabel =
    source === "stored"
      ? "사용자 입력"
      : source === "env"
        ? "환경 변수"
        : source === "default"
          ? "기본 서버"
          : "미설정";

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Plug className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-display text-sm font-bold text-foreground">Pro API 연결</h3>
          <p className="text-xs text-muted-foreground">
            Docker 설정 없이 URL만 입력하면 됩니다 · 현재: {sourceLabel}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="url"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="https://your-pro-api.example.com"
            className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={testing}
            onClick={() => void runTest()}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:brightness-110 disabled:opacity-50 sm:flex-none"
          >
            {testing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
            연결 테스트
          </button>
          <button
            type="button"
            onClick={() => {
              save(null);
              setDraft("");
              setTestResult(null);
            }}
            className="inline-flex items-center justify-center rounded-xl border border-border px-3 py-2.5 text-xs text-muted-foreground hover:bg-muted"
            title="저장된 URL 삭제"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {PRO_API_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => {
              setDraft(preset.url);
              void runTest(preset.url);
            }}
            className="rounded-lg border border-primary/15 bg-primary/5 px-2.5 py-1 text-[10px] font-semibold text-primary hover:bg-primary/10"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {testResult && (
        <p
          className={`mt-3 rounded-lg px-3 py-2 text-xs ${
            testResult.ok
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
              : "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
          }`}
        >
          {testResult.message}
        </p>
      )}
    </section>
  );
}
