"use client";

import { useState } from "react";
import { Eye, Code } from "lucide-react";
import { parseMarkdownToHtml } from "@/lib/parsers/markdown";

interface Props {
  initial: string;
  onChange: (md: string) => void;
}

export default function MarkdownEditor({ initial, onChange }: Props) {
  const [md, setMd] = useState(initial);
  const [preview, setPreview] = useState(true);

  const handleChange = (v: string) => {
    setMd(v);
    onChange(v);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 flex gap-2 px-3 py-2 bg-gray-100 border-b">
        <button
          type="button"
          onClick={() => setPreview(true)}
          className={`flex items-center gap-1 px-3 py-1 text-xs rounded ${preview ? "bg-lofice-navy text-white" : "bg-white"}`}
        >
          <Eye className="w-3.5 h-3.5" /> 미리보기
        </button>
        <button
          type="button"
          onClick={() => setPreview(false)}
          className={`flex items-center gap-1 px-3 py-1 text-xs rounded ${!preview ? "bg-lofice-navy text-white" : "bg-white"}`}
        >
          <Code className="w-3.5 h-3.5" /> 편집
        </button>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {!preview && (
          <textarea
            value={md}
            onChange={(e) => handleChange(e.target.value)}
            className="flex-1 p-4 font-mono text-sm resize-none outline-none"
            spellCheck={false}
          />
        )}
        {preview && (
          <div className="flex-1 overflow-auto p-6 bg-white">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(md) }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
