"use client";

import { X, ExternalLink, Maximize2 } from "lucide-react";
import { useRouter } from "next/navigation";
import DocumentPreviewPanel from "@/components/preview/DocumentPreviewPanel";

type Props = {
  fileId: string;
  fileName: string;
  onClose: () => void;
};

/** 모바일 풀스크린 미리보기 시트 */
export default function MobilePreviewSheet({ fileId, fileName, onClose }: Props) {
  const router = useRouter();

  return (
    <div className="lo-mobile-preview-sheet safe-top safe-bottom">
      <header className="lo-mobile-preview-header">
        <button type="button" onClick={onClose} className="lo-mobile-icon-btn" aria-label="닫기">
          <X className="h-5 w-5" />
        </button>
        <p className="lo-mobile-title flex-1">{fileName}</p>
        <button
          type="button"
          onClick={() => router.push(`/viewer/?id=${fileId}`)}
          className="lo-mobile-icon-btn"
          aria-label="전체 화면"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => router.push(`/preview/?id=${fileId}`)}
          className="lo-mobile-icon-btn"
          aria-label="미리보기 페이지"
        >
          <ExternalLink className="h-4 w-4" />
        </button>
      </header>
      <div className="min-h-0 flex-1">
        <DocumentPreviewPanel fileId={fileId} className="h-full" mobile />
      </div>
    </div>
  );
}
