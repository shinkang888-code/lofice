"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import {
  decryptOfficeDocument,
  OfficeCryptoError,
} from "@/lib/msoffice/office-crypto";

type Props = {
  buffer: ArrayBuffer;
  fileName: string;
  onDecrypted: (decrypted: ArrayBuffer, fileName: string) => void;
};

export default function OfficeDecryptGate({ buffer, fileName, onDecrypted }: Props) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { bytes } = await decryptOfficeDocument(buffer, fileName, { password });
      const ab = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
      onDecrypted(ab, fileName);
    } catch (err) {
      setError(err instanceof OfficeCryptoError ? err.message : "복호화에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-6 bg-[#c8c8c8]">
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-5 h-5 text-[#2b579a]" />
          <h2 className="text-sm font-semibold text-gray-800">암호로 보호된 Office 문서</h2>
        </div>
        <p className="text-[10px] text-gray-500 mb-4 truncate">{fileName}</p>
        <form onSubmit={(e) => void submit(e)} className="space-y-3">
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full text-sm border rounded-lg px-3 py-2 pr-10"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-2 bg-[#2b579a] text-white text-sm rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            열기
          </button>
        </form>
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      </div>
      <p className="text-[10px] text-gray-500 text-center max-w-xs">
        MS-OFFCRYPTO 복호화 · 기기에서만 처리됩니다
      </p>
    </div>
  );
}
