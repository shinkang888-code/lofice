"use client";

import { useEffect } from "react";
import { useViewerToolbar } from "@/components/office/ViewerToolbarContext";
import { downloadBuffer } from "@/lib/office/ribbon-defaults";

/** 뷰어 페이지 공통 다운로드 리본 등록 */
export default function ViewerDownloadBridge({
  buffer,
  fileName,
  mimeType,
}: {
  buffer: ArrayBuffer;
  fileName: string;
  mimeType: string;
}) {
  const { register } = useViewerToolbar();

  useEffect(() => {
    register({
      actions: {
        download: () => downloadBuffer(buffer, fileName, mimeType || undefined),
      },
    });
  }, [register, buffer, fileName, mimeType]);

  return null;
}
