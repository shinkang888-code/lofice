"use client";

import { useEffect, useState, Suspense, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getFileLocal, updateFileLocal } from "@/lib/storage/local";
import { resolveDocumentType } from "@/lib/utils";
import { isEditableType, ACCEPT_EXTENSIONS } from "@/lib/document-types";
import { isOcrSupported } from "@/lib/documentOcr/types";
import { detectHwpSecurityHint } from "@/lib/document/hwp-detect";
import { detectOfficeSecurityHint, isOfficeFormatName } from "@/lib/document/office-detect";
import { ingestDocument } from "@/lib/document/pipeline";
import DocumentViewer from "@/components/viewer/DocumentViewer";
import HwpAiAssistant from "@/components/hwp/HwpAiAssistant";
import HwpPasswordGate from "@/components/hwp/HwpPasswordGate";
import OfficeDecryptGate from "@/components/msoffice/OfficeDecryptGate";
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
  const [needsPassword, setNeedsPassword] = useState(false);
  const [officeEncrypted, setOfficeEncrypted] = useState(false);

  useEffect(() => {
    if (!id) { setError("문서 ID가 없습니다."); setLoading(false); return; }
    void (async () => {
      const file = await getFileLocal(id);
      if (!file) { setError("문서를 찾을 수 없습니다."); setLoading(false); return; }
      const type = resolveDocumentType(file.name, file.data);
      if ((type === "hwp" || type === "hwpx") && detectHwpSecurityHint(file.data, file.name) === "encrypted") {
        setNeedsPassword(true);
        setBuffer(file.data);
        setFileName(file.name);
        setFileType(type);
        setMimeType(file.type);
        setLoading(false);
        return;
      }
      if (isOfficeFormatName(file.name)) {
        const hint = await detectOfficeSecurityHint(file.data, file.name);
        if (hint === "encrypted") {
          setOfficeEncrypted(true);
          setBuffer(file.data);
          setFileName(file.name);
          setFileType(type);
          setMimeType(file.type);
          setLoading(false);
          return;
        }
      }
      setBuffer(file.data);
      setFileName(file.name);
      setMimeType(file.type);
      setFileType(type);
      setLoading(false);
    })();
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
    const result = await ingestDocument(file);
    router.push(result.route);
  };

  const handleDecrypted = async (data: ArrayBuffer, name: string) => {
    if (!id) return;
    await updateFileLocal(id, data, name);
    setBuffer(data);
    setFileName(name);
    setFileType(resolveDocumentType(name, data));
    setNeedsPassword(false);
    setOfficeEncrypted(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 bg-[#f3f3f3]">
        불러오는 중...
      </div>
    );
  }

  if (officeEncrypted && buffer) {
    return (
      <OfficeDecryptGate
        buffer={buffer}
        fileName={fileName}
        onDecrypted={handleDecrypted}
      />
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
