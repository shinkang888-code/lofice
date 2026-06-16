"use client";

import { getStirlingPdfUrl } from "@/lib/pdf/stirling-config";

interface Props {
  className?: string;
}

/** Stirling-PDF 전체 UI 임베드 (자체 Java 서버 필요) */
export default function StirlingPdfEmbed({ className = "" }: Props) {
  const base = getStirlingPdfUrl();

  if (!base) {
    return (
      <div className={`flex flex-col items-center justify-center h-full gap-3 px-6 bg-[#525659] text-white/80 text-sm ${className}`}>
        <p className="font-medium text-white">Stirling-PDF 서버 미연결</p>
        <p className="text-center max-w-md text-white/60">
          <code className="text-xs bg-black/30 px-1 rounded">NEXT_PUBLIC_STIRLING_PDF_URL</code> 환경 변수를
          설정하면 Stirling-PDF 전체 편집 UI를 임베드할 수 있습니다.
        </p>
        <a
          href="https://github.com/Stirling-Tools/Stirling-PDF"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#7eb8ff] text-xs underline"
        >
          Stirling-PDF GitHub
        </a>
      </div>
    );
  }

  return (
    <iframe
      src={base}
      title="Stirling-PDF"
      className={`w-full h-full border-0 bg-white ${className}`}
      allow="clipboard-read; clipboard-write"
    />
  );
}
