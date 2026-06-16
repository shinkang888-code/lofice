"use client";

import { getPptMasterViewerUrl } from "@/lib/ppt/ppt-master-config";

interface Props {
  projectId?: string;
  className?: string;
}

/** PPT Master 온라인 갤러리/프로젝트 뷰어 iframe */
export default function PptMasterEmbed({ projectId, className = "" }: Props) {
  const src = getPptMasterViewerUrl(projectId);

  return (
    <iframe
      src={src}
      title="PPT Master Viewer"
      className={`w-full h-full border-0 bg-[#0d0d0f] ${className}`}
      allow="fullscreen"
    />
  );
}
