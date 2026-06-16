"use client";

import { useEffect, useState, Suspense, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getFileLocal } from "@/lib/storage/local";
import { resolveDocumentType } from "@/lib/utils";
import { isEditableType, ACCEPT_EXTENSIONS } from "@/lib/document-types";
import DocumentViewer from "@/components/viewer/DocumentViewer";
import LoficeLayout from "@/components/office/LoficeLayout";
import { ViewerToolbarProvider } from "@/components/office/ViewerToolbarContext";
import type { DocumentType } from "@/types/document";

function ViewerContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<DocumentType>("unknown");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setError("문서 ID가 없습니다."); setLoading(false); return; }
    getFileLocal(id).then((file) => {
      if (!file) { setError("문서를 찾을 수 없습니다."); setLoading(false); return; }
      setBuffer(file.data);
      setFileName(file.name);
      setFileType(resolveDocumentType(file.name, file.data));
      setLoading(false);
    });
  }, [id]);

  const canEdit = isEditableType(fileType);

  const handleShare = async () => {
    if (!buffer) return;
    const blob = new Blob([buffer]);
    const file = new File([blob], fileName);
    if (navigator.share) {
      try {
        await navigator.share({ files: [file], title: fileName });
      } catch { /* cancelled */ }
    }
  };

  const handleOpenFile = useCallback(() => fileInputRef.current?.click(), []);

  const handleNewFile = async (file: File) => {
    const { saveFileLocal } = await import("@/lib/storage/local");
    const newId = await saveFileLocal(file);
    router.push(`/viewer/?id=${newId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 bg-[#f3f3f3]">
        불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 bg-[#f3f3f3] px-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <ViewerToolbarProvider>
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
        canEdit={canEdit}
        editHref={id ? `/editor/?id=${id}` : undefined}
        onShare={handleShare}
        onOpenFile={handleOpenFile}
      >
        {buffer && (
          <DocumentViewer buffer={buffer} fileName={fileName} fileType={fileType} />
        )}
      </LoficeLayout>
    </ViewerToolbarProvider>
  );
}

export default function ViewerPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400">로딩...</div>}>
      <ViewerContent />
    </Suspense>
  );
}
