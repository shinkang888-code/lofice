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

/** 지원 확장자 목록 (연결 프로그램·파일 선택용) */
export const SUPPORTED_EXTENSIONS = Object.keys(EXT_MAP);

export function getDocumentType(fileName: string): DocumentType {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return EXT_MAP[ext] ?? "unknown";
}

/** 바이너리 시그니처로 형식 감지 (확장자 오류·누락 대비) */
export function sniffDocumentType(buffer: ArrayBuffer): DocumentType | null {
  const bytes = new Uint8Array(buffer.slice(0, 16));
  const head = String.fromCharCode(...bytes.slice(0, 8));

  if (head.startsWith("%PDF-")) return "pdf";
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) {
    // ZIP — DOCX/XLSX/HWPX
    return null; // 확장자로 구분
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return "image"; // JPEG
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return "image"; // PNG
  if (head.startsWith("GIF8")) return "image";
  if (head.startsWith("<?xml") || head.startsWith("<")) return "xml";
  if (head.trimStart().startsWith("{") || head.trimStart().startsWith("[")) return "json";

  return null;
}

export function resolveDocumentType(fileName: string, buffer?: ArrayBuffer): DocumentType {
  const byExt = getDocumentType(fileName);
  if (byExt !== "unknown") return byExt;
  if (buffer) {
    const sniffed = sniffDocumentType(buffer);
    if (sniffed) return sniffed;
  }
  return "unknown";
}

export function isSupportedFile(file: File): boolean {
  if (getDocumentType(file.name) !== "unknown") return true;
  const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "");
  return ACCEPT_EXTENSIONS.split(",").includes(ext);
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

export const ACCEPT_MIME =
  "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document," +
  "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet," +
  "text/plain,text/csv,text/html,text/markdown,application/json,text/xml,application/xml," +
  "image/jpeg,image/png,image/gif,image/webp,image/bmp,image/svg+xml,application/octet-stream";

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

/** PWA manifest file_handlers용 */
export const PWA_FILE_ACCEPT: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "text/plain": [".txt", ".rtf", ".hwp", ".hwpx"],
  "text/csv": [".csv"],
  "text/html": [".html", ".htm"],
  "text/markdown": [".md", ".markdown"],
  "application/json": [".json"],
  "text/xml": [".xml"],
  "application/xml": [".xml"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
  "image/bmp": [".bmp"],
  "image/svg+xml": [".svg"],
  "application/octet-stream": [".hwp", ".hwpx"],
};
