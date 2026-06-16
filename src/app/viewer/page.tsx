"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getFileLocal } from "@/lib/storage/local";
import { getDocumentType } from "@/lib/utils";
import DocumentViewer from "@/components/viewer/DocumentViewer";
import { ArrowLeft, Edit3, Share2 } from "lucide-react";
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

  const canEdit = fileType === "docx" || fileType === "xlsx";

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

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex items-center gap-2 px-3 h-12 bg-brand-600 text-white shrink-0 safe-top">
        <button onClick={() => router.back()} className="p-2 -ml-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-sm font-medium truncate">{fileName || "문서"}</h1>
        {canEdit && (
          <button
            onClick={() => router.push(`/editor/?id=${id}`)}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-lg text-xs font-medium"
          >
            <Edit3 className="w-3.5 h-3.5" /> 편집
          </button>
        )}
        <button onClick={handleShare} className="p-2">
          <Share2 className="w-4 h-4" />
        </button>
      </header>

      <main className="flex-1 overflow-auto">
        {loading && (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">불러오는 중...</div>
        )}
        {error && (
          <div className="flex items-center justify-center h-full text-red-500 text-sm px-4 text-center">{error}</div>
        )}
        {buffer && !loading && !error && (
          <DocumentViewer buffer={buffer} fileName={fileName} fileType={fileType} />
        )}
      </main>
    </div>
  );
}

export default function ViewerPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400">로딩...</div>}>
      <ViewerContent />
    </Suspense>
  );
}
