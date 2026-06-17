"use client";

import { PRO_TARGET_LABELS, PRO_ACCEPT } from "@/lib/pro/formats";

export default function ProFormatGuide() {
  const rows = [
    { in: ".doc, .dot", out: "DOCX, PDF, ODT, HTML", note: "레거시 Word" },
    { in: ".xls, .xlt", out: "XLSX, PDF", note: "레거시 Excel" },
    { in: ".ppt, .pps", out: "PPTX, PDF", note: "레거시 PowerPoint" },
    { in: ".docx, .xlsx, .pptx", out: "PDF, HTML, ODT", note: "OOXML" },
    { in: ".odt, .ods, .odp", out: "PDF, Office", note: "OpenDocument" },
    { in: ".hwpx, .hwp", out: "DOCX, PDF", note: "한글 (Pro 권장)" },
  ];

  return (
    <details className="rounded-2xl border border-border bg-muted/20 px-4 py-3">
      <summary className="cursor-pointer text-sm font-semibold text-foreground">
        지원 형식 가이드
      </summary>
      <p className="mt-2 text-xs text-muted-foreground">
        수용 확장자: {PRO_ACCEPT.replace(/\./g, " ").trim()}
      </p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-[11px]">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="pb-2 pr-3 font-semibold">입력</th>
              <th className="pb-2 pr-3 font-semibold">출력 예시</th>
              <th className="pb-2 font-semibold">비고</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.in} className="border-b border-border/50">
                <td className="py-2 pr-3 font-mono">{row.in}</td>
                <td className="py-2 pr-3">{row.out}</td>
                <td className="py-2 text-muted-foreground">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[10px] text-muted-foreground">
        출력 형식 라벨: {Object.values(PRO_TARGET_LABELS).join(" · ")}
      </p>
    </details>
  );
}
