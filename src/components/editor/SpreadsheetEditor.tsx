"use client";

import { useState } from "react";
import type { XlsxContent } from "@/types/document";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  content: XlsxContent;
  onChange?: (content: XlsxContent) => void;
}

export default function SpreadsheetEditor({ content, onChange }: Props) {
  const [data, setData] = useState(content);
  const [activeSheet, setActiveSheet] = useState(0);
  const sheet = data.sheets[activeSheet];

  const update = (newData: XlsxContent) => {
    setData(newData);
    onChange?.(newData);
  };

  const setCell = (ri: number, ci: number, value: string) => {
    const sheets = [...data.sheets];
    const rows = sheets[activeSheet].rows.map((r) => [...r]);
    while (rows.length <= ri) rows.push([]);
    while (rows[ri].length <= ci) rows[ri].push(null);
    rows[ri][ci] = value || null;
    sheets[activeSheet] = { ...sheets[activeSheet], rows };
    update({ sheets });
  };

  const addRow = () => {
    const sheets = [...data.sheets];
    const cols = Math.max(...sheet.rows.map((r) => r.length), 1);
    sheets[activeSheet].rows.push(Array(cols).fill(null));
    update({ sheets });
  };

  const addCol = () => {
    const sheets = [...data.sheets];
    sheets[activeSheet].rows = sheets[activeSheet].rows.map((r) => [...r, null]);
    update({ sheets });
  };

  const maxCols = Math.max(...sheet.rows.map((r) => r.length), 1);

  return (
    <div className="spreadsheet-editor flex flex-col h-full">
      <div className="flex items-center gap-2 px-2 py-2 bg-gray-100 border-b shrink-0">
        {data.sheets.map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveSheet(i)}
            className={`px-3 py-1 text-sm rounded ${i === activeSheet ? "bg-white text-brand-600 font-medium" : "text-gray-600"}`}
          >
            {s.name}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={addRow} className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded">
          <Plus className="w-3 h-3" /> 행
        </button>
        <button onClick={addCol} className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded">
          <Plus className="w-3 h-3" /> 열
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="min-w-full border-collapse text-sm">
          <tbody>
            {sheet.rows.map((row, ri) => (
              <tr key={ri}>
                <td className="border border-gray-200 px-2 py-1 text-xs text-gray-400 bg-gray-50 text-center w-10">
                  {ri + 1}
                </td>
                {Array.from({ length: maxCols }).map((_, ci) => (
                  <td key={ci} className="border border-gray-200 p-0">
                    <input
                      className="w-full min-w-[80px] px-2 py-1.5 outline-none focus:bg-blue-50 text-gray-800"
                      value={String(row[ci] ?? "")}
                      onChange={(e) => setCell(ri, ci, e.target.value)}
                    />
                  </td>
                ))}
                <td className="w-8">
                  <button
                    onClick={() => {
                      const sheets = [...data.sheets];
                      sheets[activeSheet].rows.splice(ri, 1);
                      update({ sheets });
                    }}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
