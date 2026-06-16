"use client";

import ScrollCanvas from "@/components/document/ScrollCanvas";

interface Props {
  text: string;
}

export default function TxtViewer({ text }: Props) {
  return (
    <ScrollCanvas>
      <article className="txt-viewer hancom-paper mx-auto bg-white shadow-lg max-w-[210mm] w-full px-[20mm] py-[25mm] min-h-[200px]">
        <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-gray-800">
          {text}
        </pre>
      </article>
    </ScrollCanvas>
  );
}
