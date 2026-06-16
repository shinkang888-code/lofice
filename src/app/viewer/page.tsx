"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getFileLocal } from "@/lib/storage/local";
import { getDocumentType } from "@/lib/utils";
import { isEditableType } from "@/lib/document-types";
import DocumentViewer from "@/components/viewer/DocumentViewer";
import LawboxLayout from "@/components/office/LawboxLayout";
import type { DocumentType } from "@/types/document";

function ViewerContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");

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
      setFileType(getDocumentType(file.name));
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
    <LawboxLayout
      fileName={fileName}
      canEdit={canEdit}
      editHref={id ? `/editor/?id=${id}` : undefined}
      onShare={handleShare}
    >
      {buffer && (
        <DocumentViewer buffer={buffer} fileName={fileName} fileType={fileType} />
      )}
    </LawboxLayout>
  );
}

export default function ViewerPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400">로딩...</div>}>
      <ViewerContent />
    </Suspense>
  );
}
