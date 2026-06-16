"use client";

import { useState } from "react";
import type { XlsxContent } from "@/types/document";

interface Props {
  content: XlsxContent;
}

export default function XlsxViewer({ content }: Props) {
  const [activeSheet, setActiveSheet] = useState(0);
  const sheet = content.sheets[activeSheet];

  if (!sheet) return <p className="p-4 text-gray-500">시트가 없습니다.</p>;

  const maxCols = Math.max(...sheet.rows.map((r) => r.length), 1);

  return (
    <div className="xlsx-viewer flex flex-col h-full">
      {content.sheets.length > 1 && (
        <div className="flex gap-1 px-2 py-2 bg-gray-100 border-b overflow-x-auto shrink-0">
          {content.sheets.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveSheet(i)}
              className={`px-4 py-1.5 text-sm rounded-t whitespace-nowrap ${
                i === activeSheet
                  ? "bg-white text-brand-600 font-medium border-t border-x border-gray-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full border-collapse text-sm">
          <tbody>
            {sheet.rows.map((row, ri) => (
              <tr key={ri} className={ri === 0 ? "bg-gray-50 font-medium" : "hover:bg-blue-50"}>
                <td className="border border-gray-200 px-2 py-1.5 text-gray-400 text-xs w-10 text-center bg-gray-50 sticky left-0">
                  {ri + 1}
                </td>
                {Array.from({ length: maxCols }).map((_, ci) => (
                  <td key={ci} className="border border-gray-200 px-3 py-1.5 text-gray-800 whitespace-nowrap max-w-xs truncate">
                    {row[ci] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
