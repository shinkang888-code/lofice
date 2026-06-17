"use client";

import Link from "next/link";
import { Clock, ExternalLink } from "lucide-react";
import type { ProHistoryEntry } from "@/lib/pro/history";
import { PRO_TARGET_LABELS } from "@/lib/pro/formats";

type Props = {
  entries: ProHistoryEntry[];
  onClear: () => void;
};

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function ProHistoryPanel({ entries, onClear }: Props) {
  if (!entries.length) return null;

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display flex items-center gap-2 text-sm font-bold text-foreground">
          <Clock className="h-4 w-4 text-muted-foreground" />
          최근 Pro 변환
        </h3>
        <button
          type="button"
          onClick={onClear}
          className="text-[10px] font-medium text-muted-foreground hover:text-foreground"
        >
          기록 지우기
        </button>
      </div>
      <ul className="mt-3 space-y-2">
        {entries.slice(0, 8).map((entry) => (
          <li
            key={entry.id}
            className="flex flex-wrap items-center gap-2 rounded-xl bg-muted/40 px-3 py-2 text-xs"
          >
            <span className="min-w-0 flex-1 truncate font-medium">{entry.fileName}</span>
            <span className="text-muted-foreground">→ {PRO_TARGET_LABELS[entry.target]}</span>
            <span className="text-[10px] text-muted-foreground">{formatWhen(entry.at)}</span>
            {entry.savedId && (
              <Link
                href={`/viewer/?id=${encodeURIComponent(entry.savedId)}`}
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                열기
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
