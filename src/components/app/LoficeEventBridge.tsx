"use client";

import { useLoficeEvent } from "@/lib/reactTypes/hooks";

/**
 * 전역 lofice CustomEvent 구독 (Android intent · PPT 생성 등)
 * Conversion Guide window event 패턴
 */
export default function LoficeEventBridge() {
  useLoficeEvent("lofice:pptGenerated", (detail) => {
    if (process.env.NODE_ENV === "development") {
      console.info("[lofice] pptGenerated", detail.fileName, detail.source);
    }
  });

  useLoficeEvent("lofice:documentOpened", (detail) => {
    if (process.env.NODE_ENV === "development") {
      console.info("[lofice] documentOpened", detail.fileName);
    }
  });

  return null;
}
