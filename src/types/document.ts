export type DocumentType = "hwpx" | "docx" | "xlsx" | "pdf" | "txt" | "unknown";

export interface DocumentFile {
  id: string;
  name: string;
  type: DocumentType;
  size: number;
  updatedAt: string;
  source: "local" | "cloud";
}

export interface HwpxContent {
  title: string;
  sections: HwpxSection[];
}

export interface HwpxSection {
  paragraphs: HwpxParagraph[];
}

export interface HwpxParagraph {
  text: string;
  style?: string;
  align?: string;
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
