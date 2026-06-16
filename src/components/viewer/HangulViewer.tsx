"use client";

import ScrollCanvas from "@/components/document/ScrollCanvas";

interface Props {
  html: string;
  fileName: string;
  formatLabel?: string;
}

export default function HangulViewer({ html, fileName, formatLabel = "한글 문서" }: Props) {
  return (
    <div className="hancom-viewer flex flex-col h-full">
      <ScrollCanvas>
        <div className="hancom-paper mx-auto bg-white shadow-lg min-h-[297mm] max-w-[210mm] w-full px-[20mm] py-[25mm]">
          <div
            className="hancom-content prose prose-sm max-w-none
              prose-p:my-2 prose-p:leading-relaxed prose-p:text-[11pt]
              prose-headings:text-gray-900 prose-table:border-collapse
              [&_.hancom-table]:w-full [&_.hancom-table]:border [&_.hancom-table]:border-gray-400
              [&_.hancom-table_td]:border [&_.hancom-table_td]:border-gray-300 [&_.hancom-table_td]:px-2 [&_.hancom-table_td]:py-1
              [&_.hancom-table_th]:border [&_.hancom-table_th]:border-gray-300 [&_.hancom-table_th]:bg-gray-50 [&_.hancom-table_th]:px-2
              [&_img]:max-w-full [&_img]:h-auto"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </ScrollCanvas>
      <div className="shrink-0 px-4 py-1.5 bg-[#f0f0f0] border-t border-gray-300 text-xs text-gray-500 flex justify-between">
        <span>{formatLabel}</span>
        <span className="truncate ml-4">{fileName}</span>
      </div>
    </div>
  );
}
