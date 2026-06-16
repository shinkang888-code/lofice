"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { getFileLocal, updateFileLocal } from "@/lib/storage/local";
import { ACCEPT_EXTENSIONS } from "@/lib/document-types";
import { isStirlingServerAvailable } from "@/lib/pdf/stirling-config";
import LoficeLayout from "@/components/office/LoficeLayout";
import PdfEditorPanel from "@/components/pdf/PdfEditorPanel";

const StirlingPdfEmbed = dynamic(() => import("@/components/pdf/StirlingPdfEmbed"), { ssr: false });

type EditorMode = "tools" | "stirling" | "split";

function PdfEditorContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const initialMode = (params.get("mode") as EditorMode) || "tools";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<EditorMode>(initialMode);
  const stirlingAvailable = isStirlingServerAvailable();

  useEffect(() => {
    if (!id) { setError("문서 ID가 없습니다."); setLoading(false); return; }
    getFileLocal(id).then((file) => {
      if (!file) { setError("문서를 찾을 수 없습니다."); setLoading(false); return; }
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        setError("PDF 파일만 편집할 수 있습니다.");
        setLoading(false);
        return;
      }
      setBuffer(file.data);
      setFileName(file.name);
      setLoading(false);
    });
  }, [id]);

  const handleBufferChange = useCallback((data: ArrayBuffer, name?: string) => {
    setBuffer(data);
    if (name) setFileName(name);
  }, []);

  const handleSave = useCallback(async (data: ArrayBuffer) => {
    if (!id) return;
    setSaving(true);
    try {
      await updateFileLocal(id, data, fileName);
    } finally {
      setSaving(false);
    }
  }, [id, fileName]);

  const handleShare = async () => {
    if (!buffer) return;
    const file = new File([buffer], fileName, { type: "application/pdf" });
    if (navigator.share) {
      try { await navigator.share({ files: [file], title: fileName }); } catch { /* cancelled */ }
    }
  };

  const handleOpenFile = () => fileInputRef.current?.click();

  const handleNewFile = async (file: File) => {
    const { saveFileLocal } = await import("@/lib/storage/local");
    const newId = await saveFileLocal(file);
    router.push(`/pdf-editor/?id=${newId}`);
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
        {error ?? "PDF를 불러올 수 없습니다."}
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
        canEdit={false}
        onShare={handleShare}
        onOpenFile={handleOpenFile}
        onSave={() => handleSave(buffer)}
        saving={saving}
        pdfEditMode
        pdfEditorMode={mode}
        onPdfEditorModeChange={setMode}
        stirlingAvailable={stirlingAvailable}
        viewerHref={id ? `/viewer/?id=${id}` : undefined}
      >
        {mode === "stirling" && stirlingAvailable ? (
          <StirlingPdfEmbed />
        ) : (
          <PdfEditorPanel
            buffer={buffer}
            fileName={fileName}
            onBufferChange={handleBufferChange}
            onSave={id ? handleSave : undefined}
          />
        )}
      </LoficeLayout>
    </>
  );
}

export default function PdfEditorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400">로딩...</div>}>
      <PdfEditorContent />
    </Suspense>
  );
}
