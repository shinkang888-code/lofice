export type DocumentType =
  | "hwp"
  | "hwpx"
  | "docx"
  | "doc"
  | "xlsx"
  | "xls"
  | "csv"
  | "pdf"
  | "txt"
  | "rtf"
  | "markdown"
  | "html"
  | "json"
  | "xml"
  | "image"
  | "unknown";

export interface DocumentFile {
  id: string;
  name: string;
  type: DocumentType;
  size: number;
  updatedAt: string;
  source: "local" | "cloud";
}

export interface ParsedDocument {
  html?: string;
  text?: string;
  format: DocumentType;
  title?: string;
}

export interface XlsxContent {
  sheets: XlsxSheet[];
}

export interface XlsxSheet {
  name: string;
  rows: (string | number | null)[][];
}

export interface ViewerState {
  mode: "view" | "edit";
  fileName: string;
  fileType: DocumentType;
}
