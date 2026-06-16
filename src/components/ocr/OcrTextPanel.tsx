"use client";

import { useCallback, useState } from "react";
import { Copy, Loader2, ScanLine, X } from "lucide-react";
import { extractDocumentTextClient } from "@/lib/documentOcr/extractDocumentTextClient";
import { isOcrSupported, METHOD_LABEL, type DocumentOcrResult } from "@/lib/documentOcr/types";

interface Props {
  buffer: ArrayBuffer;
  fileName: string;
  mimeType: string;
  onClose?: () => void;
  className?: string;
}

/** LawyGo OCR 패널 — 클라이언트 pdfjs + Tesseract */
export default function OcrTextPanel({ buffer, fileName, mimeType, onClose, className = "" }: Props) {
  const [result, setResult] = useState<DocumentOcrResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const supported = isOcrSupported(mimeType, fileName);

  const runOcr = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await extractDocumentTextClient(buffer, fileName, mimeType, (msg) => setProgress(msg));
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "OCR 실패");
    } finally {
      setLoading(false);
      setProgress("");
    }
  }, [buffer, fileName, mimeType]);

  const copyText = async () => {
    if (!result?.text) return;
    await navigator.clipboard.writeText(result.text);
  };

  return (
    <div className={`flex flex-col h-full bg-white border-l border-gray-200 ${className}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 shrink-0 bg-[#f3f3f3]">
        <div className="flex items-center gap-2">
          <ScanLine className="w-4 h-4 text-[#2b579a]" />
          <span className="text-sm font-medium text-gray-800">텍스트 추출 (OCR)</span>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="p-1 rounded hover:bg-gray-200">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-3 border-b border-gray-100 shrink-0 space-y-2">
        {!supported ? (
          <p className="text-xs text-amber-700">PDF·이미지 파일만 OCR을 지원합니다.</p>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={() => void runOcr()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-[#2b579a] text-white rounded-lg hover:bg-[#1e3f6f] disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
            {loading ? progress || "추출 중…" : "텍스트 추출 시작"}
          </button>
        )}
        {error && <p className="text-xs text-red-600">{error}</p>}
        {result && (
          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <span>
              {METHOD_LABEL[result.method]} · {result.charCount.toLocaleString()}자
              {result.pageCount ? ` · ${result.pageCount}페이지` : ""}
            </span>
            <button type="button" onClick={() => void copyText()} className="flex items-center gap-1 hover:text-[#2b579a]">
              <Copy className="w-3 h-3" /> 복사
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-3">
        {result?.warnings?.map((w) => (
          <p key={w} className="text-[10px] text-amber-700 mb-2">{w}</p>
        ))}
        {result?.text ? (
          <pre className="text-xs whitespace-pre-wrap font-mono text-gray-800 leading-relaxed">{result.text}</pre>
        ) : (
          <p className="text-xs text-gray-400 text-center py-8">
            스캔 PDF·이미지에서 텍스트를 추출합니다.
            <br />
            PDF 텍스트 레이어 → Tesseract OCR 순으로 시도합니다.
          </p>
        )}
      </div>
    </div>
  );
}
