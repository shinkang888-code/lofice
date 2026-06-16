"use client";

import { useCallback, useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Unlock } from "lucide-react";
import {
  canEncryptOfficeFileName,
  decryptOfficeDocument,
  downloadOfficeBytes,
  encryptOfficeDocument,
  isOfficeCryptoFileName,
  isOfficeEncrypted,
  MSOFFICE_ENCRYPT_EXTS,
  OfficeCryptoError,
  type OfficeCryptoMode,
} from "@/lib/msoffice/office-crypto";
import { saveFileLocal } from "@/lib/storage/local";

export default function OfficeCryptoPanel() {
  const [mode, setMode] = useState<OfficeCryptoMode>("decrypt");
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [encMode, setEncMode] = useState<"agile" | "standard">("agile");
  const [loading, setLoading] = useState(false);
  const [encryptedHint, setEncryptedHint] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onPick = useCallback(async (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    if (!isOfficeCryptoFileName(f.name)) {
      setError(`지원 형식: ${MSOFFICE_ENCRYPT_EXTS.join(", ")} 및 doc/xls/ppt`);
      return;
    }
    setFile(f);
    setError(null);
    setMessage(null);
    const buf = await f.arrayBuffer();
    setEncryptedHint(await isOfficeEncrypted(buf));
  }, []);

  const run = async () => {
    if (!file || !password) {
      setError("파일과 비밀번호를 입력하세요.");
      return;
    }
    if (mode === "encrypt" && !canEncryptOfficeFileName(file.name)) {
      setError("암호화는 docx, xlsx, pptx만 지원합니다.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const buffer = await file.arrayBuffer();
      const result =
        mode === "decrypt"
          ? await decryptOfficeDocument(buffer, file.name, { password })
          : await encryptOfficeDocument(buffer, file.name, { password, encMode });
      downloadOfficeBytes(result.bytes, result.fileName);
      await saveFileLocal(new File([new Uint8Array(result.bytes)], result.fileName));
      setMessage(
        mode === "decrypt"
          ? `${result.fileName} 복호화 완료 · 로컬에 저장됨`
          : `${result.fileName} 암호화 완료 · 로컬에 저장됨`,
      );
    } catch (e) {
      setError(e instanceof OfficeCryptoError ? e.message : e instanceof Error ? e.message : "처리 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-[10px] text-gray-500 leading-relaxed">
        herumi/msoffice MS-OFFCRYPTO · docx/xlsx/pptx 암·복호화, 레거시 doc/xls/ppt 복호화.
        브라우저에서 처리되며 비밀번호는 서버로 전송되지 않습니다.
      </p>

      <div className="flex gap-2">
        {(["decrypt", "encrypt"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs rounded-lg border ${
              mode === m ? "bg-[#2b579a] text-white border-[#2b579a]" : "bg-white border-gray-200"
            }`}
          >
            {m === "decrypt" ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {m === "decrypt" ? "복호화" : "암호화"}
          </button>
        ))}
      </div>

      <input
        type="file"
        accept=".docx,.xlsx,.pptx,.docm,.xlsm,.pptm,.doc,.xls,.ppt"
        className="text-xs w-full"
        onChange={(e) => void onPick(e.target.files)}
      />

      {file && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
          <p className="font-medium truncate">{file.name}</p>
          {encryptedHint !== null && (
            <p className="text-[10px] mt-0.5">
              {encryptedHint ? "🔒 암호화됨" : "🔓 암호화되지 않음"}
            </p>
          )}
        </div>
      )}

      {mode === "encrypt" && (
        <label className="block text-[10px] text-gray-600">
          암호화 방식
          <select
            value={encMode}
            onChange={(e) => setEncMode(e.target.value as "agile" | "standard")}
            className="mt-1 w-full text-xs border rounded px-2 py-1.5"
          >
            <option value="agile">Agile (AES-256, 기본)</option>
            <option value="standard">Standard (AES-128)</option>
          </select>
        </label>
      )}

      <label className="block text-[10px] text-gray-600">
        비밀번호
        <div className="relative mt-1">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={255}
            placeholder="ASCII 비밀번호 (최대 255자)"
            className="w-full text-sm border rounded-lg px-3 py-2 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400"
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </label>

      <button
        type="button"
        disabled={loading || !file}
        onClick={() => void run()}
        className="w-full py-2.5 bg-[#2b579a] text-white text-sm rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "decrypt" ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        {mode === "decrypt" ? "복호화 후 다운로드" : "암호화 후 다운로드"}
      </button>

      {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>}
      {message && <p className="text-xs text-green-700 bg-green-50 p-2 rounded-lg">{message}</p>}
    </div>
  );
}
