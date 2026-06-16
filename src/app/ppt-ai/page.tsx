"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import PptAiAssistant from "@/components/ppt/PptAiAssistant";
import { saveFileLocal } from "@/lib/storage/local";
import { ACCEPT_EXTENSIONS } from "@/lib/document-types";

function PptAiContent() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");

  const onCreated = useCallback(
    async (ab: ArrayBuffer, name: string) => {
      const id = await saveFileLocal(new File([new Uint8Array(ab)], name));
      router.push(`/ppt-editor/?id=${id}`);
    },
    [router],
  );

  const onFile = async (file: File) => {
    setBuffer(await file.arrayBuffer());
    setFileName(file.name);
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <AppHeader />
      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <h1 className="text-xl font-bold text-gray-900 mb-1">PPT AI</h1>
        <p className="text-xs text-gray-500 mb-4">PowerPoint MCP · 템플릿·추출·자동 생성</p>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_EXTENSIONS}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
            e.target.value = "";
          }}
        />
        {!buffer && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full mb-4 py-2 text-xs border border-dashed rounded-lg text-gray-500"
          >
            기존 PPTX 열기 (텍스트 추출용)
          </button>
        )}
        {buffer && (
          <p className="text-[10px] text-gray-500 mb-2 truncate">열린 파일: {fileName}</p>
        )}
        <PptAiAssistant buffer={buffer} fileName={fileName} onDocumentCreated={(ab, name) => void onCreated(ab, name)} />
      </main>
      <BottomNav />
    </div>
  );
}

export default function PptAiPage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-400 text-sm">로딩…</div>}>
      <PptAiContent />
    </Suspense>
  );
}
