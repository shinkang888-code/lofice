import type { DocumentType } from "@/types/document";

const EXT_MAP: Record<string, DocumentType> = {
  hwp: "hwp",
  hwpx: "hwpx",
  docx: "docx",
  doc: "doc",
  xlsx: "xlsx",
  xls: "xls",
  csv: "csv",
  pdf: "pdf",
  txt: "txt",
  rtf: "rtf",
  md: "markdown",
  markdown: "markdown",
  html: "html",
  htm: "html",
  json: "json",
  xml: "xml",
  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  webp: "image",
  bmp: "image",
  svg: "image",
};

export function getDocumentType(fileName: string): DocumentType {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return EXT_MAP[ext] ?? "unknown";
}

export function getDocumentExtension(type: DocumentType): string {
  const reverse: Partial<Record<DocumentType, string>> = {
    hwp: "hwp", hwpx: "hwpx", docx: "docx", doc: "doc",
    xlsx: "xlsx", xls: "xls", csv: "csv", pdf: "pdf", txt: "txt",
    rtf: "rtf", markdown: "md", html: "html", json: "json", xml: "xml",
    image: "png",
  };
  return reverse[type] ?? "bin";
}

export const ACCEPT_EXTENSIONS =
  ".hwpx,.hwp,.docx,.doc,.xlsx,.xls,.csv,.pdf,.txt,.rtf,.md,.markdown,.html,.htm,.json,.xml,.jpg,.jpeg,.png,.gif,.webp,.bmp,.svg";

export const FORMAT_LABELS: Record<DocumentType, string> = {
  hwp: "한글 (HWP)",
  hwpx: "한글 (HWPX)",
  docx: "Word (DOCX)",
  doc: "Word (DOC)",
  xlsx: "Excel (XLSX)",
  xls: "Excel (XLS)",
  csv: "CSV",
  pdf: "PDF",
  txt: "텍스트",
  rtf: "RTF",
  markdown: "Markdown",
  html: "HTML",
  json: "JSON",
  xml: "XML",
  image: "이미지",
  unknown: "알 수 없음",
};

export function isEditableType(type: DocumentType): boolean {
  return [
    "hwp", "hwpx", "docx", "doc", "xlsx", "xls", "csv",
    "txt", "rtf", "markdown", "html", "json", "xml",
  ].includes(type);
}

export function isHancomType(type: DocumentType): boolean {
  return type === "hwp" || type === "hwpx";
}
