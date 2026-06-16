"use client";

import { useEffect } from "react";
import { preloadPdfEngine } from "@/lib/pdf/pdf-engine";

/** 홈/앱 진입 시 PDF 워커를 미리 로드해 첫 PDF 오픈 속도 개선 */
export default function PdfWorkerPreload() {
  useEffect(() => {
    preloadPdfEngine().catch(() => {});
  }, []);
  return null;
}
