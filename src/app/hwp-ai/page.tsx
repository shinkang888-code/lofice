"use client";

import { Suspense, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import HwpAiAssistant from "@/components/hwp/HwpAiAssistant";
import LoficeLayout from "@/components/office/LoficeLayout";
import { saveFileLocal } from "@/lib/storage/local";

function HwpAiContent() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleDocumentCreated = useCallback(
    async (buffer: ArrayBuffer, fileName: string) => {
      setSaving(true);
      try {
        const blob = new Blob([buffer], {
          type: fileName.endsWith(".hwpx")
            ? "application/vnd.hancom.hwpx"
            : "application/x-hwp",
        });
        const file = new File([blob], fileName, { type: blob.type });
        const id = await saveFileLocal(file);
        router.push(`/hwp-editor/?id=${id}`);
      } catch (e) {
        alert(e instanceof Error ? e.message : "저장 실패");
      } finally {
        setSaving(false);
      }
    },
    [router],
  );

  return (
    <LoficeLayout fileName="한글 AI 어시스턴트" minimal hwpEditMode>
      <div className="h-full max-w-3xl mx-auto border-x border-gray-200 bg-white">
        <HwpAiAssistant onDocumentCreated={(b, n) => void handleDocumentCreated(b, n)} className="border-l-0" />
        {saving && (
          <div className="fixed bottom-4 right-4 bg-gray-900 text-white text-xs px-3 py-2 rounded shadow">
            문서 저장 중…
          </div>
        )}
      </div>
    </LoficeLayout>
  );
}

export default function HwpAiPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400">로딩...</div>}>
      <HwpAiContent />
    </Suspense>
  );
}
