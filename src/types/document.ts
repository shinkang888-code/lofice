export type DocumentType =
  | "hwp"
  | "hwpx"
  | "docx"
  | "doc"
  | "odt"
  | "xlsx"
  | "xls"
  | "ods"
  | "csv"
  | "presentation"
  | "pdf"
  | "txt"
  | "rtf"
  | "mhtml"
  | "markdown"
  | "html"
  | "json"
  | "xml"
  | "image"
  | "unsupported"
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

export interface PresentationContent {
  slides: import("@/lib/parsers/pptx").PptxSlide[];
}

export interface ViewerState {
  mode: "view" | "edit";
  fileName: string;
  fileType: DocumentType;
}
