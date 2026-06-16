"use client";

import { Eye } from "lucide-react";
import { openFilePreviewById } from "@/lib/preview/documentPreview";

interface Props {
  fileId: string;
  fileName: string;
  mimeType?: string;
  className?: string;
  showLabel?: boolean;
  onPreview?: () => void;
}

export default function PreviewButton({
  fileId,
  fileName,
  mimeType = "",
  className = "",
  showLabel = false,
  onPreview,
}: Props) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPreview) {
      onPreview();
      return;
    }
    openFilePreviewById(fileId, fileName, mimeType);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`p-2 text-gray-400 hover:text-[#2b579a] hover:bg-[#2b579a]/10 rounded-lg shrink-0 ${className}`}
      title="미리보기"
    >
      <Eye className="w-4 h-4" />
      {showLabel && <span className="text-xs ml-1">미리보기</span>}
    </button>
  );
}
