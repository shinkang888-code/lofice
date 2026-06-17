"use client";

import { useState } from "react";
import { FileSpreadsheet, FileText, Loader2, Presentation } from "lucide-react";
import { analyzeXlsxBuffer } from "@/lib/excel/sheets-bridge";
import { convertPptToPdf, isPythonOfficeAvailable } from "@/lib/office/python-office-client";
import { saveFileLocal } from "@/lib/storage/local";
import { useRouter } from "next/navigation";

type Props = {
  buffer: ArrayBuffer;
  fileName: string;
  fileType: string;
};

/** Phase 2~3 — Office 배치 도구 (로컬 시트 분석 · 서버 PPT→PDF) */
export default function OfficeBatchPanel({ buffer, fileName, fileType }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzeResult, setAnalyzeResult] = useState<string | null>(null);

  const isExcel = fileType === "xlsx" || fileType === "xls" || fileName.match(/\.xlsm$/i);
  const isPpt = fileType === "presentation" || fileName.match(/\.pptx?$/i);

  const handleAnalyze = async () => {
    setLoading("analyze");
    setError(null);
    try {
      const r = await analyzeXlsxBuffer(buffer, fileName);
      const formulaSheets = r.sheets.filter((s) => s.hasFormulas).length;
      setAnalyzeResult(
        `${r.sheetCount}시트 · ${formulaSheets > 0 ? `수식 ${formulaSheets}시트` : "데이터 전용"}`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "분석 실패");
    } finally {
      setLoading(null);
    }
  };

  const handlePptPdf = async () => {
    setLoading("pdf");
    setError(null);
    try {
      const pdf = await convertPptToPdf(buffer, fileName);
      const id = await saveFileLocal(new File([pdf], fileName.replace(/\.[^.]+$/, ".pdf")));
      router.push(`/viewer/?id=${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "변환 실패");
    } finally {
      setLoading(null);
    }
  };

  if (!isExcel && !(isPpt && isPythonOfficeAvailable())) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 text-xs">
      <p className="font-semibold text-gray-800 mb-2">Office 도구</p>
      <div className="flex flex-wrap gap-2">
        {isExcel && (
          <button
            type="button"
            onClick={() => void handleAnalyze()}
            disabled={!!loading}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 hover:bg-gray-50"
          >
            {loading === "analyze" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileSpreadsheet className="h-3.5 w-3.5" />}
            시트 분석 (로컬)
          </button>
        )}
        {isPpt && isPythonOfficeAvailable() && (
          <button
            type="button"
            onClick={() => void handlePptPdf()}
            disabled={!!loading}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 hover:bg-gray-50"
          >
            {loading === "pdf" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Presentation className="h-3.5 w-3.5" />}
            PDF 변환
          </button>
        )}
      </div>
      {analyzeResult && <p className="mt-2 text-[10px] text-gray-500">{analyzeResult}</p>}
      {error && <p className="mt-2 text-[10px] text-red-600">{error}</p>}
      <p className="mt-2 text-[10px] text-gray-400 flex items-center gap-1">
        <FileText className="h-3 w-3" /> Excel 분석은 기기 내 처리
      </p>
    </div>
  );
}
