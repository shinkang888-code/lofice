"use client";

import { useState } from "react";
import { Eye, Code } from "lucide-react";

interface Props {
  initial: string;
  onChange: (html: string) => void;
}

export default function HtmlEditor({ initial, onChange }: Props) {
  const [html, setHtml] = useState(initial);
  const [preview, setPreview] = useState(false);

  const handleChange = (v: string) => {
    setHtml(v);
    onChange(v);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 flex gap-2 px-3 py-2 bg-gray-100 border-b">
        <button
          type="button"
          onClick={() => setPreview(false)}
          className={`flex items-center gap-1 px-3 py-1 text-xs rounded ${!preview ? "bg-lofice-navy text-white" : "bg-white"}`}
        >
          <Code className="w-3.5 h-3.5" /> HTML 코드
        </button>
        <button
          type="button"
          onClick={() => setPreview(true)}
          className={`flex items-center gap-1 px-3 py-1 text-xs rounded ${preview ? "bg-lofice-navy text-white" : "bg-white"}`}
        >
          <Eye className="w-3.5 h-3.5" /> 미리보기
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        {!preview ? (
          <textarea
            value={html}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm resize-none outline-none bg-[#1e1e1e] text-green-300"
            spellCheck={false}
          />
        ) : (
          <iframe
            srcDoc={html}
            title="HTML preview"
            sandbox="allow-same-origin"
            className="w-full h-full border-0"
          />
        )}
      </div>
    </div>
  );
}
