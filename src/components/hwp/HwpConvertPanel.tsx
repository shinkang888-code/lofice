"use client";

import { useState } from "react";
import { ArrowRightLeft, FileText, Loader2 } from "lucide-react";
import { base64ToArrayBuffer, convertHwpxToDocx } from "@/lib/convert/hwpx-docx";
import { isOfficeConvertAvailable } from "@/lib/convert/config";
import { saveFileLocal } from "@/lib/storage/local";
import { useRouter } from "next/navigation";

type Props = {
  buffer: ArrayBuffer;
  fileName: string;
  localId?: string;
};

/** Phase 3 — CM 기반 HWPX → DOCX 변환 */
export default function HwpConvertPanel({ buffer, fileName, localId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const available = isOfficeConvertAvailable();

  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    try {
      const hwpxName = fileName.toLowerCase().endsWith(".hwpx") ? fileName : fileName.replace(/\.hwp$/i, ".hwpx");
      const result = await convertHwpxToDocx(buffer, hwpxName);
      const docx = base64ToArrayBuffer(result.data_base64);
      const id = await saveFileLocal(new File([docx], result.file_name));
      router.push(`/editor/?id=${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "변환 실패");
    } finally {
      setLoading(false);
    }
  };

  if (!available) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
        <ArrowRightLeft className="h-4 w-4 text-[#003377]" />
        HWPX → Word 변환
      </div>
      <p className="mt-1 text-xs text-gray-500">Canonical Model 기반 DOCX 생성 (서식 일부 손실 가능)</p>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <button
        type="button"
        onClick={() => void handleConvert()}
        disabled={loading}
        className="mt-3 flex items-center gap-2 rounded-lg bg-[#003377] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
        DOCX로 변환 후 편집
      </button>
    </div>
  );
}
