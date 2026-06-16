"use client";

import ScrollCanvas from "@/components/document/ScrollCanvas";

interface Props {
  html: string;
  fileName: string;
  sandboxed?: boolean;
}

export default function HtmlViewer({ html, fileName, sandboxed = true }: Props) {
  if (sandboxed) {
    return (
      <ScrollCanvas>
        <div className="hancom-paper mx-auto bg-white shadow-lg w-full max-w-[210mm] min-h-[200px]">
          <iframe
            srcDoc={html}
            title={fileName}
            sandbox="allow-same-origin"
            className="w-full min-h-[80vh] border-0"
          />
        </div>
      </ScrollCanvas>
    );
  }

  return (
    <ScrollCanvas>
      <div
        className="hancom-paper mx-auto bg-white shadow-lg max-w-[210mm] w-full px-[20mm] py-[25mm]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </ScrollCanvas>
  );
}
