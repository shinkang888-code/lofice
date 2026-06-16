"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getFileLocal } from "@/lib/storage/local";
import { resolveDocumentType } from "@/lib/utils";
import { isOcrSupported } from "@/lib/documentOcr/types";
import DocumentViewer from "@/components/viewer/DocumentViewer";
import OcrTextPanel from "@/components/ocr/OcrTextPanel";
import LoficeLayout from "@/components/office/LoficeLayout";
import { ViewerToolbarProvider } from "@/components/office/ViewerToolbarContext";
import type { DocumentType } from "@/types/document";

function PreviewContent() {
  const params = useSearchParams();
  const id = params.get("id");
  const tab = params.get("tab");

  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<DocumentType>("unknown");
  const [mimeType, setMimeType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOcr, setShowOcr] = useState(tab === "ocr");

  useEffect(() => {
    if (!id) {
      setError("문서 ID가 없습니다.");
      setLoading(false);
      return;
    }
    getFileLocal(id).then((file) => {
      if (!file) {
        setError("문서를 찾을 수 없습니다.");
        setLoading(false);
        return;
      }
      setBuffer(file.data);
      setFileName(file.name);
      setMimeType(file.type);
      setFileType(resolveDocumentType(file.name, file.data));
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-400">미리보기 로딩…</div>;
  }

  if (error || !buffer) {
    return <div className="flex items-center justify-center h-screen text-red-500 px-4 text-center">{error}</div>;
  }

  const ocrAvailable = isOcrSupported(mimeType, fileName);

  return (
    <ViewerToolbarProvider>
      <LoficeLayout
        fileName={`미리보기: ${fileName}`}
        onOcr={ocrAvailable ? () => setShowOcr((v) => !v) : undefined}
        ocrActive={showOcr}
      >
        <div className="flex h-full min-h-0">
          <div className={`flex-1 min-w-0 min-h-0 ${showOcr ? "hidden md:block" : ""}`}>
            <DocumentViewer buffer={buffer} fileName={fileName} fileType={fileType} />
          </div>
          {showOcr && ocrAvailable && (
            <div className="w-full md:w-[380px] shrink-0 border-l border-gray-200 min-h-0">
              <OcrTextPanel
                buffer={buffer}
                fileName={fileName}
                mimeType={mimeType}
                onClose={() => setShowOcr(false)}
              />
            </div>
          )}
        </div>
      </LoficeLayout>
    </ViewerToolbarProvider>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400">로딩…</div>}>
      <PreviewContent />
    </Suspense>
  );
}
