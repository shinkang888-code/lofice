import Link from "next/link";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";

export default function LegalPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20">
      <AppHeader />
      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full prose prose-sm">
        <h1 className="text-xl font-bold text-gray-900">라이선스 및 서드파티 고지</h1>
        <p className="text-sm text-gray-600">Loffice Desktop v2.25 — 고객 납품용</p>

        <h2 className="text-base font-semibold mt-6">1. Loffice (자작)</h2>
        <p className="text-sm text-gray-700">
          Copyright © 2026 LoBooK AI Studio / Loffice. MIT License.
          UI, Electron 래퍼, 도구 허브, 통합 코드.
        </p>

        <h2 className="text-base font-semibold mt-6">2. LibreOffice / Collabora</h2>
        <p className="text-sm text-gray-700">
          Writer/Calc/Impress 편집 엔진: LibreOffice Core (MPL-2.0), Collabora Online (MPL-2.0).
          엔진 사용 시 MPL-2.0 고지 및 수정분 공개 의무를 준수해야 합니다.
        </p>

        <h2 className="text-base font-semibold mt-6">3. 주요 OSS 의존성</h2>
        <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
          <li>Next.js, React — MIT</li>
          <li>Electron — MIT</li>
          <li>pdfjs-dist — Apache-2.0</li>
          <li>@rhwp/core, @rhwp/editor — 각 패키지 LICENSE 참조</li>
          <li>@eigenpal/docx-editor-react — MIT</li>
          <li>@microscope-js/* — MIT</li>
          <li>@supabase/supabase-js — MIT</li>
        </ul>

        <h2 className="text-base font-semibold mt-6">4. 상표</h2>
        <p className="text-sm text-gray-700">
          LibreOffice®는 The Document Foundation의 등록상표입니다.
          Loffice는 독립 제품이며 TDF와 공식 제휴가 없을 수 있습니다.
        </p>

        <p className="mt-8 text-xs text-gray-400">
          전체 목록: 저장소 <code>THIRD_PARTY_NOTICES.md</code>
        </p>
        <Link href="/settings/" className="text-sm text-[#003377] hover:underline">
          ← 설정으로
        </Link>
      </main>
      <BottomNav />
    </div>
  );
}
