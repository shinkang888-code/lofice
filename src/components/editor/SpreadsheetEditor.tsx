"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { XlsxContent } from "@/types/document";
import { Plus, Trash2 } from "lucide-react";
import { useEditorToolbarOptional } from "@/components/office/EditorToolbarContext";

interface Props {
  content: XlsxContent;
  onChange?: (content: XlsxContent) => void;
}

function colLabel(index: number): string {
  let n = index;
  let label = "";
  while (n >= 0) {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  }
  return label;
}

function cellRef(row: number, col: number): string {
  return `${colLabel(col)}${row + 1}`;
}

export default function SpreadsheetEditor({ content, onChange }: Props) {
  const toolbar = useEditorToolbarOptional();
  const [data, setData] = useState(content);
  const [activeSheet, setActiveSheet] = useState(0);
  const [activeCell, setActiveCell] = useState({ row: 0, col: 0 });
  const [formulaValue, setFormulaValue] = useState("");
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const sheet = data.sheets[activeSheet];
  const maxCols = Math.max(...sheet.rows.map((r) => r.length), 26);
  const displayCols = Math.max(maxCols, 12);

  const update = useCallback(
    (newData: XlsxContent) => {
      setData(newData);
      onChange?.(newData);
    },
    [onChange]
  );

  const getCellValue = useCallback(
    (ri: number, ci: number) => String(sheet.rows[ri]?.[ci] ?? ""),
    [sheet.rows]
  );

  useEffect(() => {
    setFormulaValue(getCellValue(activeCell.row, activeCell.col));
  }, [activeCell, getCellValue]);

  const setCell = useCallback(
    (ri: number, ci: number, value: string) => {
      const sheets = [...data.sheets];
      const rows = sheets[activeSheet].rows.map((r) => [...r]);
      while (rows.length <= ri) rows.push([]);
      while (rows[ri].length <= ci) rows[ri].push(null);
      rows[ri][ci] = value || null;
      sheets[activeSheet] = { ...sheets[activeSheet], rows };
      update({ sheets });
    },
    [data.sheets, activeSheet, update]
  );

  useEffect(() => {
    toolbar?.register({
      docType: "spreadsheet",
      activeCell: cellRef(activeCell.row, activeCell.col),
      sheetName: sheet.name,
      copy: () => {
        const val = getCellValue(activeCell.row, activeCell.col);
        navigator.clipboard.writeText(val).catch(() => {});
      },
      paste: async () => {
        try {
          const text = await navigator.clipboard.readText();
          setCell(activeCell.row, activeCell.col, text);
        } catch { /* ignore */ }
      },
    });
    return () => toolbar?.reset();
  }, [toolbar, activeCell, sheet.name, getCellValue, setCell]);

  const focusCell = (ri: number, ci: number) => {
    setActiveCell({ row: ri, col: ci });
    requestAnimationFrame(() => {
      inputRefs.current.get(`${ri}-${ci}`)?.focus();
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, ri: number, ci: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      focusCell(Math.min(ri + 1, sheet.rows.length), ci);
    } else if (e.key === "Tab") {
      e.preventDefault();
      focusCell(ri, ci + (e.shiftKey ? -1 : 1));
    } else if (e.key === "ArrowDown" && e.altKey) {
      e.preventDefault();
      focusCell(ri + 1, ci);
    } else if (e.key === "ArrowUp" && e.altKey) {
      e.preventDefault();
      focusCell(Math.max(0, ri - 1), ci);
    } else if (e.key === "ArrowRight" && e.altKey) {
      e.preventDefault();
      focusCell(ri, ci + 1);
    } else if (e.key === "ArrowLeft" && e.altKey) {
      e.preventDefault();
      focusCell(ri, Math.max(0, ci - 1));
    }
  };

  const addRow = () => {
    const sheets = [...data.sheets];
    sheets[activeSheet].rows.push(Array(displayCols).fill(null));
    update({ sheets });
  };

  const addCol = () => {
    const sheets = [...data.sheets];
    sheets[activeSheet].rows = sheets[activeSheet].rows.map((r) => [...r, null]);
    update({ sheets });
  };

  const colWidths = useMemo(() => Array.from({ length: displayCols }, () => 96), [displayCols]);

  return (
    <div className="spreadsheet-editor flex flex-col h-full bg-[#f3f3f3] select-none">
      {/* 수식 입력줄 — Excel/폴라리스 스타일 */}
      <div className="flex items-stretch shrink-0 border-b border-gray-300 bg-[#f3f3f3] h-8">
        <div className="w-16 flex items-center justify-center text-xs font-mono text-gray-600 border-r border-gray-300 bg-white">
          {cellRef(activeCell.row, activeCell.col)}
        </div>
        <div className="w-8 flex items-center justify-center text-xs text-gray-400 border-r border-gray-300">fx</div>
        <input
          className="flex-1 px-2 text-sm bg-white outline-none font-mono"
          value={formulaValue}
          onChange={(e) => setFormulaValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setCell(activeCell.row, activeCell.col, formulaValue);
              (e.target as HTMLInputElement).blur();
            }
          }}
          onBlur={() => setCell(activeCell.row, activeCell.col, formulaValue)}
        />
      </div>

      {/* 그리드 */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="border-collapse text-sm spreadsheet-grid">
          <thead className="sticky top-0 z-10">
            <tr>
              <th className="spreadsheet-corner" />
              {colWidths.map((_, ci) => (
                <th key={ci} className="spreadsheet-col-header">
                  {colLabel(ci)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheet.rows.map((row, ri) => (
              <tr key={ri}>
                <td className="spreadsheet-row-header">{ri + 1}</td>
                {Array.from({ length: displayCols }).map((_, ci) => {
                  const isActive = activeCell.row === ri && activeCell.col === ci;
                  return (
                    <td key={ci} className={`spreadsheet-cell ${isActive ? "spreadsheet-cell-active" : ""}`}>
                      <input
                        ref={(el) => {
                          if (el) inputRefs.current.set(`${ri}-${ci}`, el);
                          else inputRefs.current.delete(`${ri}-${ci}`);
                        }}
                        className="spreadsheet-cell-input"
                        value={String(row[ci] ?? "")}
                        onFocus={() => {
                          setActiveCell({ row: ri, col: ci });
                          setFormulaValue(String(row[ci] ?? ""));
                        }}
                        onChange={(e) => setCell(ri, ci, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, ri, ci)}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 시트 탭 + 도구 — 하단 Excel 스타일 */}
      <div className="flex items-center gap-1 px-2 py-1 bg-[#e8e8e8] border-t border-gray-300 shrink-0 overflow-x-auto">
        {data.sheets.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setActiveSheet(i);
              setActiveCell({ row: 0, col: 0 });
            }}
            className={`px-3 py-1 text-xs rounded-t border border-b-0 ${
              i === activeSheet
                ? "bg-white text-[#2b579a] font-medium border-gray-300"
                : "bg-[#f3f3f3] text-gray-600 border-transparent hover:bg-gray-200"
            }`}
          >
            {s.name}
          </button>
        ))}
        <div className="flex-1" />
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded"
        >
          <Plus className="w-3 h-3" /> 행
        </button>
        <button
          type="button"
          onClick={addCol}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded"
        >
          <Plus className="w-3 h-3" /> 열
        </button>
        <button
          type="button"
          onClick={() => {
            const sheets = [...data.sheets];
            sheets[activeSheet].rows.splice(activeCell.row, 1);
            update({ sheets });
          }}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded"
        >
          <Trash2 className="w-3 h-3" /> 행 삭제
        </button>
      </div>
    </div>
  );
}
