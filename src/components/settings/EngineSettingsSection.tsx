"use client";

import { useCallback, useEffect, useState } from "react";
import { Server, Sparkles } from "lucide-react";
import {
  checkLofficeEngineHealth,
  wakeLofficeEngine,
  type EngineHealth,
} from "@/lib/loffice-engine/client";
import {
  getLofficeEngineUrl,
  getStoredEngineUrl,
  saveStoredEngineUrl,
  LOFFICE_ENGINE_DEFAULT_URL,
} from "@/lib/loffice-engine/config";

export default function EngineSettingsSection() {
  const [url, setUrl] = useState(LOFFICE_ENGINE_DEFAULT_URL);
  const [health, setHealth] = useState<EngineHealth | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    setUrl(getStoredEngineUrl() || LOFFICE_ENGINE_DEFAULT_URL);
  }, []);

  const testConnection = useCallback(async () => {
    setTesting(true);
    saveStoredEngineUrl(url);
    await wakeLofficeEngine();
    const h = await checkLofficeEngineHealth();
    setHealth(h);
    setTesting(false);
  }, [url]);

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Server className="h-4 w-4 text-[#2b579a]" />
        <h2 className="text-sm font-semibold text-gray-800">Loffice LibreOffice 엔진</h2>
      </div>
      <p className="text-[10px] text-gray-500">
        Writer/Calc 전체 메뉴는 Collabora + 엔진(server.mjs) 실행 시{" "}
        <span className="font-medium">/engine-editor/</span>에서 열립니다.
      </p>
      <label className="block text-xs font-medium text-gray-700">엔진 URL</label>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={LOFFICE_ENGINE_DEFAULT_URL}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
      />
      <button
        type="button"
        onClick={() => void testConnection()}
        disabled={testing}
        className="inline-flex items-center gap-1.5 rounded-xl bg-[#003377] px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {testing ? "연결 중…" : "엔진 연결 테스트"}
      </button>
      {health && (
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs text-gray-700">
          <p>LibreOffice: {health.ok ? "연결됨" : "오프라인"}</p>
          <p>Collabora: {health.collabora ? "편집 가능 (전체 메뉴)" : "미실행 — docker compose up -d"}</p>
          {health.libreOffice && <p className="mt-1 truncate text-[10px] text-gray-500">{health.libreOffice}</p>}
          <p className="mt-1 text-[10px] text-gray-400">현재: {getLofficeEngineUrl()}</p>
        </div>
      )}
    </section>
  );
}
