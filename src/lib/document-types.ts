import type { DocumentType } from "@/types/document";
import { isArchiveFileName } from "@/lib/archive/archive-types";
import { MS_OFFICE_FORMATS } from "@/lib/msoffice/format-registry";

/** MS Office + 한글 + 웹 형식 확장자 → DocumentType */
const EXT_MAP: Record<string, DocumentType> = Object.fromEntries(
  MS_OFFICE_FORMATS.map((f) => [f.ext, f.type])
);

export const SUPPORTED_EXTENSIONS = [...new Set(MS_OFFICE_FORMATS.map((f) => f.ext))];

export function getDocumentType(fileName: string): DocumentType {
  const lower = fileName.toLowerCase();
  for (const ext of ["tbz2", "txz", "tgz", "tar.gz", "tar.bz2", "tar.xz"]) {
    if (lower.endsWith(ext)) return "archive";
  }
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (isArchiveFileName(fileName)) return "archive";
  return EXT_MAP[ext] ?? "unknown";
}

export function sniffDocumentType(buffer: ArrayBuffer): DocumentType | null {
  const bytes = new Uint8Array(buffer.slice(0, 16));
  if (bytes[0] === 0x37 && bytes[1] === 0x7a && bytes[2] === 0xbc && bytes[3] === 0xaf) return "archive";
  if (bytes[0] === 0x52 && bytes[1] === 0x61 && bytes[2] === 0x72 && bytes[3] === 0x21) return "archive";
  const head = String.fromCharCode(...bytes.slice(0, 8));

  if (head.startsWith("%PDF-")) return "pdf";
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) return null;
  if (bytes[0] === 0xd0 && bytes[1] === 0xcf) return null; // OLE — doc/xls/ppt by extension
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return "image";
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return "image";
  if (head.startsWith("GIF8")) return "image";
  if (head.startsWith("RIFF")) return "image";
  if (head.trimStart().startsWith("{\\rtf")) return "rtf";
  if (head.startsWith("MIME-Version") || head.startsWith("From:")) return "mhtml";
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
  return getDocumentType(file.name) !== "unknown";
}

export function getDocumentExtension(type: DocumentType): string {
  const reverse: Partial<Record<DocumentType, string>> = {
    hwp: "hwp", hwpx: "hwpx", docx: "docx", doc: "doc", odt: "odt",
    xlsx: "xlsx", xls: "xls", ods: "ods", csv: "csv", presentation: "pptx",
    pdf: "pdf", txt: "txt", rtf: "rtf", mhtml: "mht", markdown: "md",
    html: "html", json: "json", xml: "xml", image: "png",
  };
  return reverse[type] ?? "bin";
}

export const ACCEPT_EXTENSIONS = SUPPORTED_EXTENSIONS.map((e) => `.${e}`).join(",");

export const ACCEPT_MIME =
  "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document," +
  "application/vnd.ms-word.document.macroEnabled.12,application/vnd.openxmlformats-officedocument.wordprocessingml.template," +
  "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet," +
  "application/vnd.ms-excel.sheet.macroEnabled.12,application/vnd.openxmlformats-officedocument.presentationml.presentation," +
  "application/vnd.ms-powerpoint,application/vnd.oasis.opendocument.text,application/vnd.oasis.opendocument.spreadsheet," +
  "application/vnd.oasis.opendocument.presentation,text/plain,text/csv,text/html,text/rtf,message/rfc822," +
  "text/markdown,application/json,text/xml,application/xml,image/*,application/octet-stream";

export const FORMAT_LABELS: Record<DocumentType, string> = {
  hwp: "한글 (HWP)",
  hwpx: "한글 (HWPX)",
  docx: "Word (DOCX)",
  doc: "Word (DOC)",
  odt: "OpenDocument (ODT)",
  xlsx: "Excel (XLSX)",
  xls: "Excel (XLS)",
  ods: "OpenDocument (ODS)",
  csv: "CSV",
  presentation: "PowerPoint",
  pdf: "PDF",
  txt: "텍스트",
  rtf: "RTF",
  mhtml: "MHTML",
  markdown: "Markdown",
  html: "HTML",
  json: "JSON",
  xml: "XML",
  image: "이미지",
  archive: "압축 파일",
  unsupported: "미지원 (Office 전용)",
  unknown: "알 수 없음",
};

export function isEditableType(type: DocumentType): boolean {
  return [
    "hwp", "hwpx", "docx", "doc", "odt", "xlsx", "xls", "ods", "csv",
    "presentation",
    "txt", "rtf", "markdown", "html", "json", "xml",
  ].includes(type);
}

export function isHancomType(type: DocumentType): boolean {
  return type === "hwp" || type === "hwpx";
}

export const PWA_FILE_ACCEPT: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc", ".dot"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx", ".dotx"],
  "application/vnd.ms-word.document.macroEnabled.12": [".docm", ".dotm"],
  "application/vnd.ms-excel": [".xls", ".xlt"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx", ".xltx"],
  "application/vnd.ms-excel.sheet.macroEnabled.12": [".xlsm", ".xltm"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx", ".potx", ".ppsx"],
  "application/vnd.ms-powerpoint": [".ppt", ".pps", ".pot"],
  "application/vnd.oasis.opendocument.text": [".odt"],
  "application/vnd.oasis.opendocument.spreadsheet": [".ods"],
  "application/vnd.oasis.opendocument.presentation": [".odp"],
  "text/plain": [".txt", ".rtf", ".wri", ".wpd", ".wps", ".hwp", ".hwpx"],
  "text/csv": [".csv", ".dif"],
  "text/html": [".html", ".htm", ".mht", ".mhtml"],
  "text/rtf": [".rtf"],
  "text/markdown": [".md", ".markdown"],
  "application/json": [".json"],
  "text/xml": [".xml"],
  "application/xml": [".xml"],
  "image/jpeg": [".jpg", ".jpeg", ".jfif", ".jpe"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
  "image/bmp": [".bmp"],
  "image/tiff": [".tif", ".tiff"],
  "image/svg+xml": [".svg"],
  "application/octet-stream": [".hwp", ".hwpx", ".xlsb", ".slk"],
};
