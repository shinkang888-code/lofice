"use client";

import { useState } from "react";
import { Lock, Loader2, Unlock } from "lucide-react";
import { hwpxSkillDecryptHwp, base64ToArrayBuffer } from "@/lib/hwpxSkill/api";
import { isHwpxSkillServerAvailable } from "@/lib/hwpxSkill/config";
import { isLikelyEncryptedHwpError } from "@/lib/document/hwp-detect";

type Props = {
  buffer: ArrayBuffer;
  fileName: string;
  onDecrypted: (buffer: ArrayBuffer, fileName: string) => void;
  onCancel?: () => void;
};

/** Phase 2 — 암호 HWP 게이트 */
export default function HwpPasswordGate({ buffer, fileName, onDecrypted, onCancel }: Props) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const serverOk = isHwpxSkillServerAvailable();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!serverOk) {
        throw new Error("암호 해제는 hwpx-skill 서버가 필요합니다.");
      }
      const result = await hwpxSkillDecryptHwp(buffer, fileName, password);
      if (!result.ok || !result.data_base64) {
        throw new Error(result.message ?? "비밀번호가 올바르지 않거나 지원되지 않는 문서입니다.");
      }
      onDecrypted(base64ToArrayBuffer(result.data_base64), result.file_name ?? fileName.replace(/\.hwp$/i, ".hwpx"));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "복호화 실패";
      setError(isLikelyEncryptedHwpError(msg) ? msg : `복호화 실패: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-[#f2f2f7] p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-black/5 bg-white p-6 shadow-lg"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">암호로 보호된 한글 문서</h2>
        <p className="mt-1 text-sm text-gray-500 truncate">{fileName}</p>
        <p className="mt-3 text-xs text-gray-400">
          배포용(DRM) 문서는 오픈소스로 완전 지원되지 않을 수 있습니다.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="문서 비밀번호"
          className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20"
          autoFocus
        />
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        <div className="mt-4 flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600"
            >
              취소
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#003377] py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4" />}
            열기
          </button>
        </div>
      </form>
    </div>
  );
}
