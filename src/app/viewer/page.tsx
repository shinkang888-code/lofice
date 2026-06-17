"use client";

import { useEffect, useState, Suspense, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getFileLocal } from "@/lib/storage/local";
import { resolveDocumentType } from "@/lib/utils";
import { isEditableType, ACCEPT_EXTENSIONS } from "@/lib/document-types";
import { isOcrSupported } from "@/lib/documentOcr/types";
import DocumentViewer from "@/components/viewer/DocumentViewer";
import HwpAiAssistant from "@/components/hwp/HwpAiAssistant";
import OcrTextPanel from "@/components/ocr/OcrTextPanel";
import LoficeLayout from "@/components/office/LoficeLayout";
import MobileViewerSplit from "@/components/mobile/MobileViewerSplit";
import { saveFileLocal } from "@/lib/storage/local";
import { ViewerToolbarProvider } from "@/components/office/ViewerToolbarContext";
import ViewerDownloadBridge from "@/components/viewer/ViewerDownloadBridge";
import type { DocumentType } from "@/types/document";

function ViewerContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<DocumentType>("unknown");
  const [mimeType, setMimeType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOcr, setShowOcr] = useState(params.get("tab") === "ocr");
  const [showHwpAi, setShowHwpAi] = useState(params.get("tab") === "hwp-ai");

  useEffect(() => {
    if (!id) { setError("문서 ID가 없습니다."); setLoading(false); return; }
    getFileLocal(id).then((file) => {
      if (!file) { setError("문서를 찾을 수 없습니다."); setLoading(false); return; }
      setBuffer(file.data);
      setFileName(file.name);
      setMimeType(file.type);
      setFileType(resolveDocumentType(file.name, file.data));
      setLoading(false);
    });
  }, [id]);

  const canEdit = isEditableType(fileType);
  const ocrAvailable = buffer ? isOcrSupported(mimeType, fileName) : false;
  const hwpAiAvailable = fileType === "hwp" || fileType === "hwpx";
  const showSide = (showOcr && ocrAvailable) || (showHwpAi && hwpAiAvailable);

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

  const sidePanel = showOcr && ocrAvailable && buffer ? (
    <OcrTextPanel
      buffer={buffer}
      fileName={fileName}
      mimeType={mimeType}
      onClose={() => setShowOcr(false)}
    />
  ) : showHwpAi && hwpAiAvailable && buffer ? (
    <HwpAiAssistant
      buffer={buffer}
      fileName={fileName}
      onClose={() => setShowHwpAi(false)}
      onDocumentCreated={async (data, name) => {
        const blob = new Blob([data], { type: "application/vnd.hancom.hwpx" });
        const newId = await saveFileLocal(new File([blob], name));
        router.push(`/hwp-editor/?id=${newId}`);
      }}
    />
  ) : null;

  return (
    <ViewerToolbarProvider>
      {buffer && <ViewerDownloadBridge buffer={buffer} fileName={fileName} mimeType={mimeType} />}
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
        onOcr={ocrAvailable ? () => setShowOcr((v) => !v) : undefined}
        ocrActive={showOcr}
        onHwpAi={hwpAiAvailable ? () => setShowHwpAi((v) => !v) : undefined}
        hwpAiActive={showHwpAi}
        pdfEditHref={fileType === "pdf" && id ? `/pdf-editor/?id=${id}` : undefined}
        hwpEditHref={(fileType === "hwp" || fileType === "hwpx") && id ? `/hwp-editor/?id=${id}` : undefined}
        pptEditHref={fileType === "presentation" && id ? `/ppt-editor/?id=${id}` : undefined}
      >
        <MobileViewerSplit
          showSide={!!showSide}
          sideLabel={showOcr ? "OCR" : "한글 AI"}
          document={
            buffer ? (
              <DocumentViewer buffer={buffer} fileName={fileName} fileType={fileType} />
            ) : null
          }
          side={sidePanel}
          sideWidthClass={showHwpAi ? "md:w-[400px]" : "md:w-[380px]"}
        />
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
