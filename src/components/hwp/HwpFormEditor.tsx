"use client";

import { useEffect, useState } from "react";
import { FileInput, Loader2, Wand2 } from "lucide-react";
import {
  base64ToArrayBuffer,
  hwpxSkillAnalyze,
  hwpxSkillCloneForm,
  hwpxSkillOwpmlPatch,
} from "@/lib/hwpxSkill/api";
import { isHwpxSkillServerAvailable } from "@/lib/hwpxSkill/config";

type Props = {
  buffer: ArrayBuffer;
  fileName: string;
  onPatched: (buffer: ArrayBuffer, fileName: string) => void;
};

/** Phase 2 — 누름틀·양식 필드 편집 (clone-form / owpml patch) */
export default function HwpFormEditor({ buffer, fileName, onPatched }: Props) {
  const [fields, setFields] = useState<string[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const serverOk = isHwpxSkillServerAvailable();

  useEffect(() => {
    if (!serverOk) {
      setAnalyzing(false);
      return;
    }
    void hwpxSkillAnalyze(buffer, fileName)
      .then((r) => {
        const unique = [...new Set(r.texts.filter((t) => t.length < 80))].slice(0, 12);
        setFields(unique);
        const init: Record<string, string> = {};
        unique.forEach((t) => { init[t] = t; });
        setValues(init);
      })
      .catch(() => setFields([]))
      .finally(() => setAnalyzing(false));
  }, [buffer, fileName, serverOk]);

  const handleApply = async () => {
    setLoading(true);
    setError(null);
    const replacements: Record<string, string> = {};
    Object.entries(values).forEach(([k, v]) => {
      if (v !== k) replacements[k] = v;
    });
    if (Object.keys(replacements).length === 0) {
      setError("변경된 필드가 없습니다.");
      setLoading(false);
      return;
    }
    try {
      const result = await hwpxSkillOwpmlPatch(buffer, fileName, replacements);
      onPatched(base64ToArrayBuffer(result.data_base64), result.file_name);
    } catch {
      try {
        const fallback = await hwpxSkillCloneForm(buffer, fileName, replacements);
        onPatched(base64ToArrayBuffer(fallback.data_base64), fallback.file_name);
      } catch (e) {
        setError(e instanceof Error ? e.message : "양식 편집 실패");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!serverOk) {
    return (
      <p className="p-4 text-sm text-gray-500">양식 편집은 hwpx-skill 서버 연결이 필요합니다.</p>
    );
  }

  if (analyzing) {
    return (
      <div className="flex items-center justify-center gap-2 p-8 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" /> 양식 분석 중…
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col border-l border-gray-200 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
        <FileInput className="h-4 w-4 text-[#003377]" />
        <h3 className="text-sm font-semibold text-gray-900">누름틀 · 양식 필드</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {fields.length === 0 ? (
          <p className="text-xs text-gray-400">자동 감지된 필드가 없습니다. clone-form으로 직접 치환해 보세요.</p>
        ) : (
          fields.map((field) => (
            <label key={field} className="block">
              <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400 line-clamp-1">{field}</span>
              <input
                value={values[field] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [field]: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#003377]"
              />
            </label>
          ))
        )}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
      <div className="border-t border-gray-100 p-3">
        <button
          type="button"
          onClick={() => void handleApply()}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003377] py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          양식 적용
        </button>
      </div>
    </div>
  );
}
