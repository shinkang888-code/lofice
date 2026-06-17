"use client";

import { Check, Minus } from "lucide-react";

const ROWS = [
  { feature: "레거시 .doc / .xls / .ppt", browser: "제한적", pro: "LibreOffice 정규화" },
  { feature: "HWPX → DOCX 품질", browser: "경량 변환", pro: "서버 고품질" },
  { feature: "ODF → Office/PDF", browser: "부분", pro: "전체 지원" },
  { feature: "복잡한 표·머리글", browser: "근사치", pro: "픽셀급 호환" },
  { feature: "오프라인 동작", browser: "✓ WASM", pro: "API 필요" },
  { feature: "설치·Docker", browser: "불필요", pro: "URL만 입력" },
];

export default function ProComparePanel() {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <h3 className="font-display text-sm font-bold text-foreground">lofice vs lofice Pro</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        브라우저 엔진은 빠르고, Pro는 LibreOffice로 호환성을 보완합니다.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[360px] text-left text-[11px]">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="pb-2 pr-3 font-semibold">기능</th>
              <th className="pb-2 pr-3 font-semibold">lofice</th>
              <th className="pb-2 font-semibold">lofice Pro</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.feature} className="border-b border-border/50">
                <td className="py-2 pr-3 font-medium text-foreground">{row.feature}</td>
                <td className="py-2 pr-3 text-muted-foreground">
                  {row.browser === "✓ WASM" ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600">
                      <Check className="h-3 w-3" /> WASM
                    </span>
                  ) : (
                    row.browser
                  )}
                </td>
                <td className="py-2 font-medium text-primary">{row.pro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 flex items-center gap-1 text-[10px] text-muted-foreground">
        <Minus className="h-3 w-3" />
        Pro API URL은 /pro/ 또는 설정에서 입력 — Docker는 나중에 연결 가능
      </p>
    </section>
  );
}
