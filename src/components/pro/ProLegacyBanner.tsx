"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function ProLegacyBanner() {
  return (
    <div className="mb-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-[var(--lofice-gold)]/10 p-4">
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground">레거시 Office (.doc · .xls · .ppt)?</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            브라우저 변환으로는 한계가 있습니다.{" "}
            <strong className="text-foreground">lofice Pro</strong>에서 LibreOffice 엔진으로 변환하세요.
          </p>
        </div>
        <Link
          href="/pro/"
          className="inline-flex shrink-0 items-center rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white hover:brightness-110"
        >
          lofice Pro 열기
        </Link>
      </div>
    </div>
  );
}
