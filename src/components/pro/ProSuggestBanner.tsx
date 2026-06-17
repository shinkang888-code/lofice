"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { buildProRouteFromFile, getProRecommendCopy } from "@/lib/pro/detect";

type Props = {
  fileName: string;
  localId?: string;
  compact?: boolean;
  className?: string;
};

export default function ProSuggestBanner({ fileName, localId, compact, className = "" }: Props) {
  const copy = getProRecommendCopy(fileName);
  if (!copy) return null;

  const href = localId ? buildProRouteFromFile(localId) : "/pro/";

  if (compact) {
    return (
      <div className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/15 bg-primary/5 px-3 py-2 ${className}`}>
        <p className="text-xs text-foreground">
          <Sparkles className="mr-1 inline h-3.5 w-3.5 text-primary" />
          {copy.title} — Pro 변환 권장
        </p>
        <Link href={href} className="text-xs font-bold text-primary hover:underline">
          Pro 열기 →
        </Link>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-[var(--lofice-gold)]/10 p-4 ${className}`}>
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground">{copy.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{copy.desc}</p>
        </div>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white hover:brightness-110"
        >
          lofice Pro
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
