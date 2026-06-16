"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listFilesLocal } from "@/lib/storage/local";
import { getDocumentType, formatFileSize, formatDate } from "@/lib/utils";
import { FileText, Table, File, ImageIcon, FileCode, Clock } from "lucide-react";
import type { DocumentType } from "@/types/document";

const iconMap: Record<DocumentType, typeof File> = {
  hwp: FileText, hwpx: FileText, docx: FileText, doc: FileText, odt: FileText,
  xlsx: Table, xls: Table, ods: Table, csv: Table, presentation: FileText,
  pdf: File, txt: FileText, rtf: FileText, mhtml: FileCode,
  markdown: FileCode, html: FileCode, json: FileCode, xml: FileCode,
  image: ImageIcon, unsupported: File, unknown: File,
};

export default function RecentDocuments() {
  const [files, setFiles] = useState<Awaited<ReturnType<typeof listFilesLocal>>>([]);

  useEffect(() => {
    listFilesLocal().then(setFiles).catch(() => setFiles([]));
  }, []);

  if (files.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-3">
        <Clock className="w-4 h-4" />
        최근 문서
      </h2>
      <div className="space-y-2">
        {files.slice(0, 5).map((file) => {
          const docType = getDocumentType(file.name);
          const Icon = iconMap[docType] ?? File;
          return (
            <Link
              key={file.id}
              href={`/viewer/?id=${file.id}`}
              className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/15 backdrop-blur rounded-xl border border-white/10 transition-colors"
            >
              <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{file.name}</p>
                <p className="text-[10px] text-white/50">
                  {formatDate(file.updatedAt)}
                  {file.size ? ` · ${formatFileSize(file.size)}` : ""}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
