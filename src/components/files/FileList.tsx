"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listFilesLocal } from "@/lib/storage/local";
import { getDocumentType, formatFileSize, formatDate } from "@/lib/utils";
import type { DocumentType } from "@/types/document";
import { FileText, Table, File, Trash2, ImageIcon, FileCode, ScanLine, Archive, ChevronRight } from "lucide-react";
import { deleteFileLocal } from "@/lib/storage/local";
import PreviewButton from "@/components/preview/PreviewButton";
import DocumentPreviewPanel from "@/components/preview/DocumentPreviewPanel";
import MobilePreviewSheet from "@/components/mobile/MobilePreviewSheet";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { isOcrSupported } from "@/lib/documentOcr/types";

interface FileItem {
  id: string;
  name: string;
  type: string;
  updatedAt: string;
  size?: number;
}

const iconMap: Record<DocumentType, typeof File> = {
  hwp: FileText, hwpx: FileText, docx: FileText, doc: FileText, odt: FileText,
  xlsx: Table, xls: Table, ods: Table, csv: Table, presentation: FileText,
  pdf: File, txt: FileText, rtf: FileText, mhtml: FileCode,
  markdown: FileCode, html: FileCode, json: FileCode, xml: FileCode,
  image: ImageIcon, archive: Archive, unsupported: File, unknown: File,
};

export default function FileList() {
  const isMobile = useIsMobile();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const previewFile = files.find((f) => f.id === previewId);

  const refresh = async () => {
    setLoading(true);
    try {
      const list = await listFilesLocal();
      setFiles(list as FileItem[]);
    } catch {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("이 문서를 삭제할까요?")) return;
    await deleteFileLocal(id);
    if (previewId === id) setPreviewId(null);
    refresh();
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400 text-sm">불러오는 중...</div>;
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">저장된 문서가 없습니다</p>
        <p className="text-gray-400 text-xs mt-1">위에서 문서를 열어보세요</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 min-h-[40vh]">
        <div className="flex-1 space-y-2 min-w-0">
          {files.map((file) => {
            const docType = getDocumentType(file.name);
            const Icon = iconMap[docType] ?? File;
            const ocr = isOcrSupported(file.type, file.name);
            const selected = previewId === file.id;
            return (
              <div
                key={file.id}
                className={`lo-mobile-file-row ${selected ? "lo-mobile-file-row-active" : ""}`}
              >
                <Link href={`/viewer/?id=${file.id}`} className="flex items-center gap-3 flex-1 min-w-0 py-1">
                  <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate text-[15px]">{file.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(file.updatedAt)}
                      {file.size ? ` · ${formatFileSize(file.size)}` : ""}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 md:hidden" />
                </Link>
                <div className="flex items-center gap-0.5 shrink-0">
                  <PreviewButton
                    fileId={file.id}
                    fileName={file.name}
                    mimeType={file.type}
                    onPreview={() => setPreviewId(file.id)}
                    className="lo-mobile-touch-btn"
                  />
                  {ocr && (
                    <Link
                      href={`/viewer/?id=${file.id}&tab=ocr`}
                      title="OCR"
                      className="lo-mobile-touch-btn text-gray-400"
                    >
                      <ScanLine className="w-4 h-4" />
                    </Link>
                  )}
                  <button
                    onClick={(e) => handleDelete(file.id, e)}
                    className="lo-mobile-touch-btn text-gray-300 hover:text-red-500"
                    aria-label="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {!isMobile && (
          <div className="hidden md:block lg:w-[420px] shrink-0 rounded-2xl border border-gray-200 overflow-hidden bg-[#525659] min-h-[320px] lg:min-h-0 lg:h-[calc(100dvh-12rem)] sticky top-4">
            <DocumentPreviewPanel fileId={previewId} className="h-full" />
          </div>
        )}
      </div>

      {isMobile && previewId && previewFile && (
        <MobilePreviewSheet
          fileId={previewId}
          fileName={previewFile.name}
          onClose={() => setPreviewId(null)}
        />
      )}
    </>
  );
}
