import * as XLSX from "xlsx";
import type { XlsxContent } from "@/types/document";

export function parseXlsx(buffer: ArrayBuffer): XlsxContent {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheets = workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name];
    const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, {
      header: 1, defval: null, raw: false,
    });
    return { name, rows: rows as (string | number | null)[][] };
  });
  return { sheets };
}

export async function parseXlsxFromFile(file: File): Promise<XlsxContent> {
  return parseXlsx(await file.arrayBuffer());
}

export function xlsxToCsv(buffer: ArrayBuffer, sheetIndex = 0): string {
  const wb = XLSX.read(buffer, { type: "array" });
  const name = wb.SheetNames[sheetIndex];
  if (!name) return "";
  return XLSX.utils.sheet_to_csv(wb.Sheets[name]);
}
