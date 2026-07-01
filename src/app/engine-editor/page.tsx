"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import { getLofficeEditorUrl } from "@/lib/loffice-engine/client";
import { getLofficeEngineUrl } from "@/lib/loffice-engine/config";

function EngineEditorContent() {
  const params = useSearchParams();
  const router = useRouter();
  const docId = params.get("id");
  const name = params.get("name") || "문서";
  const [editorUrl, setEditorUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!docId) {
      router.replace("/");
      return;
    }
    getLofficeEditorUrl(docId)
      .then((url) => {
        if (url) setEditorUrl(url);
        else setError("Collabora 편집 엔진에 연결할 수 없습니다.");
      })
      .catch(() => setError("엔진 연결 실패"))
      .finally(() => setLoading(false));
  }, [docId, router]);

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-[#f0f0f0]">
        <Loader2 className="h-10 w-10 animate-spin text-[#003377]" />
        <p className="text-sm text-gray-600">LibreOffice Writer/Calc 편집기 로딩 중…</p>
      </div>
    );
  }

  if (error || !editorUrl) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#f0f0f0] p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500" />
        <h1 className="text-lg font-bold">편집 엔진 미연결</h1>
        <p className="max-w-md text-sm text-gray-600">{error}</p>
        <code className="rounded bg-white px-3 py-2 text-xs">docker compose up -d</code>
        <p className="text-xs text-gray-500">엔진: {getLofficeEngineUrl()}</p>
        <Link href="/settings/" className="text-sm font-semibold text-[#003377] hover:underline">
          설정에서 엔진 URL 확인
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-10 shrink-0 items-center gap-3 border-b bg-[#003377] px-3 text-white">
        <button type="button" onClick={() => router.back()} className="rounded p-1 hover:bg-white/10" aria-label="뒤로">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="truncate text-sm font-medium">{name}</span>
        <span className="ml-auto text-[10px] text-white/70">LibreOffice · Collabora</span>
      </header>
      <iframe
        src={editorUrl}
        className="min-h-0 flex-1 border-0"
        title={`Loffice Editor — ${name}`}
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}

export default function EngineEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#003377]" />
        </div>
      }
    >
      <EngineEditorContent />
    </Suspense>
  );
}
