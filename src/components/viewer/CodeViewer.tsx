"use client";

import ScrollCanvas from "@/components/document/ScrollCanvas";

interface Props {
  code: string;
  fileName: string;
  language: "json" | "xml" | "text";
}

export default function CodeViewer({ code, fileName, language }: Props) {
  let display = code;
  if (language === "json") {
    try {
      display = JSON.stringify(JSON.parse(code), null, 2);
    } catch { /* keep raw */ }
  }

  return (
    <ScrollCanvas bgClassName="bg-[#1e1e1e]">
      <pre className="text-sm text-green-300 font-mono p-4 whitespace-pre min-w-max">
        <code>{display}</code>
      </pre>
      <div className="text-xs text-gray-400 text-center py-2">
        {language.toUpperCase()} · {fileName}
      </div>
    </ScrollCanvas>
  );
}
