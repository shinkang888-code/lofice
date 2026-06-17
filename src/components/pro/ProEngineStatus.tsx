"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Server, WifiOff } from "lucide-react";
import { fetchProHealth, getProApiBase, resolveEngineState } from "@/lib/pro/client";
import { PRO_API_URL_CHANGED } from "@/lib/pro/settings";
import type { ProEngineState, ProHealthResponse } from "@/lib/pro/types";

const STATE_UI: Record<
  ProEngineState,
  { label: string; hint: string; icon: typeof CheckCircle2; className: string }
> = {
  ready: {
    label: "Pro 엔진 준비됨",
    hint: "LibreOffice headless가 연결되어 고품질 변환을 사용할 수 있습니다.",
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100",
  },
  degraded: {
    label: "API만 연결됨",
    hint: "서버는 응답하지만 LibreOffice가 없습니다. Pro API URL·서버 설정을 확인하세요.",
    icon: AlertCircle,
    className: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100",
  },
  offline: {
    label: "Pro 엔진 오프라인",
    hint: "위 Pro API 연결에서 URL을 입력하고「연결 테스트」를 실행하세요.",
    icon: WifiOff,
    className: "border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100",
  },
};

type Props = {
  onStateChange?: (state: ProEngineState, health: ProHealthResponse | null) => void;
};

export default function ProEngineStatus({ onStateChange }: Props) {
  const [health, setHealth] = useState<ProHealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<ProEngineState>("offline");

  const refresh = useCallback(async () => {
    setLoading(true);
    const h = await fetchProHealth();
    const s = resolveEngineState(h);
    setHealth(h);
    setState(s);
    onStateChange?.(s, h);
    setLoading(false);
  }, [onStateChange]);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), 30_000);
    const onUrlChange = () => void refresh();
    window.addEventListener(PRO_API_URL_CHANGED, onUrlChange);
    return () => {
      window.clearInterval(id);
      window.removeEventListener(PRO_API_URL_CHANGED, onUrlChange);
    };
  }, [refresh]);

  const ui = STATE_UI[state];
  const Icon = ui.icon;
  const apiBase = getProApiBase();

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 ${ui.className}`}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/60 dark:bg-black/20">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin opacity-70" />
          ) : (
            <Icon className="h-5 w-5" aria-hidden />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-sm font-bold sm:text-base">{ui.label}</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/50 px-2 py-0.5 text-[10px] font-medium dark:bg-black/20">
              <Server className="h-3 w-3" />
              LibreOffice Pro
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed opacity-90 sm:text-sm">{ui.hint}</p>
          {apiBase && (
            <p className="mt-2 truncate font-mono text-[10px] opacity-70">{apiBase}</p>
          )}
          {health?.features?.length ? (
            <p className="mt-1 text-[10px] opacity-60">
              {health.features.join(" · ")}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="shrink-0 rounded-lg border border-current/20 px-2.5 py-1 text-[10px] font-semibold hover:bg-white/30 disabled:opacity-50"
        >
          새로고침
        </button>
      </div>
    </div>
  );
}
