"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";

type Props = {
  showSide: boolean;
  sideLabel: string;
  document: React.ReactNode;
  side: React.ReactNode;
  sideWidthClass?: string;
};

/** 데스크톱: 좌우 분할 · 모바일: 세그먼트 탭 전환 */
export default function MobileViewerSplit({
  showSide,
  sideLabel,
  document,
  side,
  sideWidthClass = "md:w-[380px]",
}: Props) {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState<"doc" | "side">("doc");

  if (!showSide) {
    return <div className="flex h-full min-h-0 flex-1">{document}</div>;
  }

  if (isMobile) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="lo-mobile-segment shrink-0">
          <button
            type="button"
            className={tab === "doc" ? "lo-mobile-segment-active" : ""}
            onClick={() => setTab("doc")}
          >
            문서
          </button>
          <button
            type="button"
            className={tab === "side" ? "lo-mobile-segment-active" : ""}
            onClick={() => setTab("side")}
          >
            {sideLabel}
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          {tab === "doc" ? document : side}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-1">
      <div className="min-h-0 min-w-0 flex-1">{document}</div>
      <div className={`min-h-0 shrink-0 border-l border-gray-200 w-full ${sideWidthClass}`}>{side}</div>
    </div>
  );
}
