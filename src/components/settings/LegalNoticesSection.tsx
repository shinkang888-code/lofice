"use client";

import Link from "next/link";
import { Scale } from "lucide-react";

export default function LegalNoticesSection() {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2">
        <Scale className="h-4 w-4 text-[#2b579a]" />
        <h2 className="text-sm font-semibold text-gray-800">라이선스 및 고지</h2>
      </div>
      <div className="rounded-xl border border-gray-100 bg-white p-4 text-xs text-gray-600 space-y-2">
        <p>
          <strong className="text-gray-800">Loffice</strong> 앱 UI·Electron 셸·통합 코드 © 2026 LoBooK / Loffice.
          MIT License (자작 부분).
        </p>
        <p>
          LibreOffice 엔진·Collabora Online: <strong>MPL-2.0</strong> — 수정 시 소스 공개 의무가 있을 수 있습니다.
        </p>
        <p>
          Colibre 아이콘 및 UI XML 구조: The Document Foundation (MPL-2.0 / CC0).
        </p>
        <p>
          서드파티: pdfjs (Apache-2.0), rhwp, eigenpal, Supabase SDK 등 —{" "}
          <Link href="/settings/legal/" className="font-semibold text-[#003377] hover:underline">
            전체 고지 보기
          </Link>
        </p>
      </div>
    </section>
  );
}
