"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listFilesLocal } from "@/lib/storage/local";
import { getDocumentType, formatFileSize, formatDate } from "@/lib/utils";
import type { DocumentType } from "@/types/document";
import { FileText, Table, File, Trash2, ImageIcon, FileCode, ScanLine } from "lucide-react";
import { deleteFileLocal } from "@/lib/storage/local";
import PreviewButton from "@/components/preview/PreviewButton";
import DocumentPreviewPanel from "@/components/preview/DocumentPreviewPanel";
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
  image: ImageIcon, unsupported: File, unknown: File,
};

export default function FileList() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewId, setPreviewId] = useState<string | null>(null);

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
        <p className="text-gray-400 text-xs mt-1">홈에서 문서를 열어보세요</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 min-h-[60vh]">
      <div className="flex-1 space-y-2 min-w-0">
        {files.map((file) => {
          const docType = getDocumentType(file.name);
          const Icon = iconMap[docType] ?? File;
          const ocr = isOcrSupported(file.type, file.name);
          return (
            <div
              key={file.id}
              className={`flex items-center gap-2 p-3 bg-white rounded-xl border transition-all ${
                previewId === file.id ? "border-[#2b579a] shadow-sm" : "border-gray-100 hover:border-brand-200"
              }`}
            >
              <Link href={`/viewer/?id=${file.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(file.updatedAt)}
                    {file.size ? ` · ${formatFileSize(file.size)}` : ""}
                  </p>
                </div>
              </Link>
              <PreviewButton
                fileId={file.id}
                fileName={file.name}
                mimeType={file.type}
                onPreview={() => setPreviewId(file.id)}
              />
              {ocr && (
                <Link
                  href={`/viewer/?id=${file.id}&tab=ocr`}
                  title="OCR 텍스트 추출"
                  className="p-2 text-gray-400 hover:text-[#2b579a] hover:bg-[#2b579a]/10 rounded-lg"
                >
                  <ScanLine className="w-4 h-4" />
                </Link>
              )}
              <button
                onClick={(e) => handleDelete(file.id, e)}
                className="p-2 text-gray-300 hover:text-red-500 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="lg:w-[420px] shrink-0 rounded-xl border border-gray-200 overflow-hidden bg-[#525659] min-h-[320px] lg:min-h-0 lg:h-[calc(100dvh-12rem)] sticky top-4">
        <DocumentPreviewPanel fileId={previewId} className="h-full" />
      </div>
    </div>
  );
}
