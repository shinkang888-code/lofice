"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getFileLocal, updateFileLocal } from "@/lib/storage/local";
import { getDocumentType } from "@/lib/utils";
import { isHancomType } from "@/lib/parsers/hancom";
import { ACCEPT_EXTENSIONS } from "@/lib/document-types";
import RhwpEditor, { type RhwpEditorHandle } from "@/components/hwp/RhwpEditor";
import LoficeLayout from "@/components/office/LoficeLayout";

function HwpEditorContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const editorRef = useRef<RhwpEditorHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    if (!id) { setError("문서 ID가 없습니다."); setLoading(false); return; }
    getFileLocal(id).then((file) => {
      if (!file) { setError("문서를 찾을 수 없습니다."); setLoading(false); return; }
      const type = getDocumentType(file.name);
      if (!isHancomType(type)) {
        setError("HWP/HWPX 파일만 편집할 수 있습니다.");
        setLoading(false);
        return;
      }
      setBuffer(file.data);
      setFileName(file.name);
      setLoading(false);
    });
  }, [id]);

  const handleSave = useCallback(async () => {
    if (!id || !editorRef.current) return;
    setSaving(true);
    try {
      const verify = await editorRef.current.exportVerify();
      if (verify && !verify.recovered) {
        console.warn("[RhwpEditor] HWP 직렬화 검증 경고", verify);
      }
      const data = await editorRef.current.save();
      if (!data) throw new Error("저장 데이터 없음");
      await updateFileLocal(id, data, fileName);
      router.push(`/viewer/?id=${id}`);
    } catch (e) {
      alert(e instanceof Error ? e.message : "저장 실패");
    } finally {
      setSaving(false);
    }
  }, [id, fileName, router]);

  const handleShare = async () => {
    if (!buffer) return;
    const file = new File([buffer], fileName);
    if (navigator.share) {
      try { await navigator.share({ files: [file], title: fileName }); } catch { /* cancelled */ }
    }
  };

  const handleOpenFile = () => fileInputRef.current?.click();

  const handleNewFile = async (file: File) => {
    const { saveFileLocal } = await import("@/lib/storage/local");
    const newId = await saveFileLocal(file);
    router.push(`/hwp-editor/?id=${newId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 bg-[#f3f3f3]">
        불러오는 중...
      </div>
    );
  }

  if (error || !buffer) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 bg-[#f3f3f3] px-4 text-center">
        {error ?? "문서를 불러올 수 없습니다."}
      </div>
    );
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_EXTENSIONS}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleNewFile(file);
          e.target.value = "";
        }}
      />
      <LoficeLayout
        fileName={fileName}
        onSave={handleSave}
        saving={saving}
        minimal
        hwpEditMode
        viewerHref={id ? `/viewer/?id=${id}` : undefined}
        onHwpAi={() => router.push(id ? `/viewer/?id=${id}&tab=hwp-ai` : "/hwp-ai/")}
      >
        <RhwpEditor
          ref={editorRef}
          buffer={buffer}
          fileName={fileName}
          onReady={setPageCount}
        />
      </LoficeLayout>
      {pageCount > 0 && (
        <span className="sr-only">{pageCount}페이지</span>
      )}
    </>
  );
}

export default function HwpEditorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400">로딩...</div>}>
      <HwpEditorContent />
    </Suspense>
  );
}
