"use client";

import ScrollCanvas from "@/components/document/ScrollCanvas";

interface Props {
  html: string;
  fileName: string;
}

export default function MarkdownViewer({ html, fileName }: Props) {
  return (
    <ScrollCanvas>
      <div className="hancom-paper mx-auto bg-white shadow-lg min-h-[297mm] max-w-[210mm] w-full px-[20mm] py-[25mm]">
        <div
          className="hancom-content prose prose-sm max-w-none
            prose-headings:text-lawbox-navy prose-a:text-lawbox-navy
            prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <div className="shrink-0 px-4 py-1.5 bg-[#f0f0f0] border-t border-gray-300 text-xs text-gray-500 text-center mt-2">
        Markdown · {fileName}
      </div>
    </ScrollCanvas>
  );
}
