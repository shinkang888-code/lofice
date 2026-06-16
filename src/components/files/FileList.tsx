"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listFilesLocal } from "@/lib/storage/local";
import { getDocumentType, formatFileSize, formatDate } from "@/lib/utils";
import { FileText, Table, File, Trash2 } from "lucide-react";
import { deleteFileLocal } from "@/lib/storage/local";

interface FileItem {
  id: string;
  name: string;
  type: string;
  updatedAt: string;
  size?: number;
}

const iconMap = {
  hwpx: FileText, docx: FileText, xlsx: Table, pdf: File, txt: FileText, unknown: File,
};

export default function FileList() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="space-y-2">
      {files.map((file) => {
        const docType = getDocumentType(file.name);
        const Icon = iconMap[docType] ?? File;
        return (
          <Link
            key={file.id}
            href={`/viewer/?id=${file.id}`}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all"
          >
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
            <button
              onClick={(e) => handleDelete(file.id, e)}
              className="p-2 text-gray-300 hover:text-red-500 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </Link>
        );
      })}
    </div>
  );
}
