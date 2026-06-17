/**
 * Excel → 구조화 JSON (Sheets 브릿지 Phase 3)
 * Google Sheets API 없이 빠른 로컬 분석·보내기
 */
import type { XlsxSheet } from "@/types/document";

export type SheetAnalysis = {
  fileName: string;
  sheetCount: number;
  sheets: Array<{
    name: string;
    rows: number;
    cols: number;
    hasFormulas: boolean;
    preview: (string | number | null)[][];
  }>;
  compatibility: {
    cells: "full" | "partial";
    merge: "partial";
    charts: "none";
    pivot: "none";
    vba: "none";
  };
};

export async function analyzeXlsxBuffer(buffer: ArrayBuffer, fileName: string): Promise<SheetAnalysis> {
  const XLSX = await import("xlsx");
  const wb = XLSX.read(buffer, { type: "array", cellFormula: true });
  const sheets = wb.SheetNames.map((name) => {
    const sheet = wb.Sheets[name]!;
    const ref = sheet["!ref"];
    const range = ref ? XLSX.utils.decode_range(ref) : { e: { r: 0, c: 0 } };
    const rows = range.e.r + 1;
    const cols = range.e.c + 1;
    const json = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, {
      header: 1,
      defval: null,
    }) as (string | number | null)[][];
    const hasFormulas = Object.keys(sheet).some((k) => k.startsWith("!") === false && sheet[k]?.f);
    return {
      name,
      rows,
      cols,
      hasFormulas,
      preview: json.slice(0, 20),
    };
  });

  return {
    fileName,
    sheetCount: sheets.length,
    sheets,
    compatibility: {
      cells: "full",
      merge: "partial",
      charts: "none",
      pivot: "none",
      vba: "none",
    },
  };
}

export function sheetsToCsvBundles(sheets: XlsxSheet[]): { name: string; csv: string }[] {
  return sheets.map((s) => ({
    name: s.name,
    csv: s.rows.map((row) => row.map((c) => (c == null ? "" : String(c))).join(",")).join("\n"),
  }));
}

export async function xlsxToStructuredJson(buffer: ArrayBuffer): Promise<Record<string, unknown>> {
  const analysis = await analyzeXlsxBuffer(buffer, "workbook.xlsx");
  return {
    version: 1,
    sheetCount: analysis.sheetCount,
    sheets: analysis.sheets.map((s) => ({
      name: s.name,
      dimensions: { rows: s.rows, cols: s.cols },
      data: s.preview,
    })),
  };
}
