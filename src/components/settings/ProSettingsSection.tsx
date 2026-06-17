"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import ProConnectionPanel from "@/components/pro/ProConnectionPanel";

export default function ProSettingsSection() {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-800">lofice Pro</h2>
        <Link
          href="/pro/"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2b579a] hover:underline"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Pro 워크벤치
        </Link>
      </div>
      <p className="text-[10px] text-gray-500">
        Pro API URL은 서버 없이 저장만 됩니다. Docker·원격 API 준비 후 연결 테스트하세요.
      </p>
      <ProConnectionPanel />
    </section>
  );
}
