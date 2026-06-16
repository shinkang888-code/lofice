"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { getFileLocal } from "@/lib/storage/local";
import { resolveDocumentType } from "@/lib/utils";
import { openFilePreviewById } from "@/lib/preview/documentPreview";
import DocumentViewer from "@/components/viewer/DocumentViewer";
import type { DocumentType } from "@/types/document";

interface Props {
  fileId: string | null;
  className?: string;
}

/** LawyGo DocumentPreviewPanel — lofice IndexedDB + DocumentViewer */
export default function DocumentPreviewPanel({ fileId, className = "" }: Props) {
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<DocumentType>("unknown");
  const [mimeType, setMimeType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileId) {
      setBuffer(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getFileLocal(fileId)
      .then((file) => {
        if (cancelled) return;
        if (!file) {
          setError("파일을 찾을 수 없습니다.");
          setBuffer(null);
          return;
        }
        setBuffer(file.data);
        setFileName(file.name);
        setMimeType(file.type);
        setFileType(resolveDocumentType(file.name, file.data));
      })
      .catch(() => {
        if (!cancelled) setError("파일을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fileId]);

  if (!fileId) {
    return (
      <div className={`flex items-center justify-center text-xs text-gray-400 p-4 text-center ${className}`}>
        파일을 선택하거나 「미리보기」를 눌러 주세요.
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center gap-2 text-sm text-gray-500 p-6 ${className}`}>
        <Loader2 className="w-5 h-5 animate-spin" />
        로딩 중…
      </div>
    );
  }

  if (error || !buffer) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 text-xs text-gray-500 p-4 text-center ${className}`}>
        <p className="font-medium truncate max-w-full">{fileName}</p>
        <p>{error ?? "미리보기를 표시할 수 없습니다."}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-0 h-full bg-[#525659] ${className}`}>
      <div className="px-3 py-1.5 border-b border-black/20 flex items-center justify-between gap-2 shrink-0 bg-[#2b579a] text-white">
        <p className="text-[11px] font-medium truncate flex-1">{fileName}</p>
        <button
          type="button"
          onClick={() => openFilePreviewById(fileId, fileName, mimeType)}
          className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded hover:bg-white/15"
        >
          <ExternalLink className="w-3 h-3" />
          새 창
        </button>
      </div>
      <div className="flex-1 min-h-0">
        <DocumentViewer buffer={buffer} fileName={fileName} fileType={fileType} />
      </div>
    </div>
  );
}
