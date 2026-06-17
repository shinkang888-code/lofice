"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getFileLocal, updateFileLocal } from "@/lib/storage/local";
import { getDocumentType } from "@/lib/utils";
import { isHancomType } from "@/lib/parsers/hancom";
import { ACCEPT_EXTENSIONS } from "@/lib/document-types";
import { detectHwpSecurityHint } from "@/lib/document/hwp-detect";
import { ingestDocument } from "@/lib/document/pipeline";
import RhwpEditor, { type RhwpEditorHandle } from "@/components/hwp/RhwpEditor";
import HwpPasswordGate from "@/components/hwp/HwpPasswordGate";
import HwpFormEditor from "@/components/hwp/HwpFormEditor";
import HwpConvertPanel from "@/components/hwp/HwpConvertPanel";
import LoficeLayout from "@/components/office/LoficeLayout";

function HwpEditorContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const showForm = params.get("panel") === "form";
  const editorRef = useRef<RhwpEditorHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [formOpen, setFormOpen] = useState(showForm);

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
      const hint = detectHwpSecurityHint(file.data, file.name);
      if (hint === "encrypted") {
        setNeedsPassword(true);
        setBuffer(file.data);
        setFileName(file.name);
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

  const handleOpenFile = () => fileInputRef.current?.click();

  const handleNewFile = async (file: File) => {
    const result = await ingestDocument(file);
    router.push(result.route);
  };

  const handleDecrypted = async (data: ArrayBuffer, name: string) => {
    if (!id) return;
    await updateFileLocal(id, data, name);
    setBuffer(data);
    setFileName(name);
    setNeedsPassword(false);
  };

  const handleFormPatched = async (data: ArrayBuffer, name: string) => {
    if (!id) return;
    await updateFileLocal(id, data, name);
    setBuffer(data);
    setFileName(name);
    setFormOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 bg-[#f3f3f3]">
        불러오는 중...
      </div>
    );
  }

  if (needsPassword && buffer) {
    return (
      <HwpPasswordGate
        buffer={buffer}
        fileName={fileName}
        onDecrypted={handleDecrypted}
        onCancel={() => router.push("/files/")}
      />
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
          if (file) void handleNewFile(file);
          e.target.value = "";
        }}
      />
      <LoficeLayout
        fileName={fileName}
        onSave={handleSave}
        saving={saving}
        onOpenFile={handleOpenFile}
        hwpEditMode
        viewerHref={id ? `/viewer/?id=${id}` : undefined}
        onHwpAi={() => router.push(id ? `/viewer/?id=${id}&tab=hwp-ai` : "/hwp-ai/")}
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex min-h-0 flex-1">
            <div className="min-h-0 min-w-0 flex-1 flex flex-col">
              <RhwpEditor
                ref={editorRef}
                buffer={buffer}
                fileName={fileName}
                onReady={setPageCount}
              />
            </div>
            {formOpen && (
              <div className="w-full md:w-80 shrink-0 min-h-0 border-l border-gray-200">
                <HwpFormEditor buffer={buffer} fileName={fileName} onPatched={handleFormPatched} />
              </div>
            )}
          </div>
          <div className="shrink-0 border-t border-gray-100 bg-gray-50 p-2 flex flex-wrap gap-2 items-center justify-between">
            <p className="text-[11px] text-gray-500 px-1">
              양식 편집 · HWPX→DOCX 변환 · 상단 메뉴에서 AI
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormOpen((v) => !v)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700"
              >
                {formOpen ? "양식 닫기" : "양식 필드"}
              </button>
              <HwpConvertPanel buffer={buffer} fileName={fileName} localId={id ?? undefined} />
            </div>
          </div>
        </div>
      </LoficeLayout>
      {pageCount > 0 && <span className="sr-only">{pageCount}페이지</span>}
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
