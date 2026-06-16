"use client";

import ScrollCanvas from "@/components/document/ScrollCanvas";

interface Props {
  html: string;
}

export default function DocxViewer({ html }: Props) {
  return (
    <ScrollCanvas>
      <article className="docx-viewer hancom-paper mx-auto bg-white shadow-lg max-w-[210mm] w-full px-[20mm] py-[25mm] min-h-[200px]">
        <div
          className="hancom-content prose prose-sm max-w-none
            prose-headings:text-gray-900 prose-p:text-gray-800 prose-p:leading-relaxed
            prose-table:border prose-td:border prose-td:px-3 prose-td:py-2
            prose-th:border prose-th:px-3 prose-th:py-2 prose-th:bg-gray-50"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </ScrollCanvas>
  );
}
