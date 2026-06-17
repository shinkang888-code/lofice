/**
 * MS Office 뷰어가 열 수 있는 형식 레지스트리 (Office14 분석 + 표준 스펙)
 * @see docs/MSOFFICE-ARCHITECTURE.md
 */

import type { DocumentType } from "@/types/document";

export type OfficeApp = "word" | "excel" | "powerpoint" | "publisher" | "visio" | "access" | "onenote" | "outlook" | "viewer" | "image";

export interface FormatEntry {
  ext: string;
  type: DocumentType;
  app: OfficeApp;
  label: string;
  /** lofice 뷰어 구현 수준 */
  support: "full" | "partial" | "metadata";
}

/** MS Office 연동 형식 전체 목록 */
export const MS_OFFICE_FORMATS: FormatEntry[] = [
  // Word
  { ext: "docx", type: "docx", app: "word", label: "Word 문서", support: "full" },
  { ext: "docm", type: "docx", app: "word", label: "Word 매크로 문서", support: "full" },
  { ext: "dotx", type: "docx", app: "word", label: "Word 서식", support: "full" },
  { ext: "dotm", type: "docx", app: "word", label: "Word 매크로 서식", support: "full" },
  { ext: "doc", type: "doc", app: "word", label: "Word 97-2003", support: "partial" },
  { ext: "dot", type: "doc", app: "word", label: "Word 97-2003 서식", support: "partial" },
  { ext: "rtf", type: "rtf", app: "word", label: "서식 있는 텍스트", support: "full" },
  { ext: "odt", type: "odt", app: "word", label: "OpenDocument 텍스트", support: "full" },
  { ext: "txt", type: "txt", app: "word", label: "일반 텍스트", support: "full" },
  { ext: "wri", type: "txt", app: "word", label: "Windows Write", support: "partial" },
  { ext: "wpd", type: "txt", app: "word", label: "WordPerfect", support: "partial" },
  { ext: "wps", type: "txt", app: "word", label: "Works 문서", support: "partial" },
  { ext: "htm", type: "html", app: "word", label: "HTML", support: "full" },
  { ext: "html", type: "html", app: "word", label: "HTML", support: "full" },
  { ext: "mht", type: "mhtml", app: "word", label: "MHTML", support: "full" },
  { ext: "mhtml", type: "mhtml", app: "word", label: "MHTML", support: "full" },
  { ext: "xml", type: "xml", app: "word", label: "XML", support: "full" },
  // Excel
  { ext: "xlsx", type: "xlsx", app: "excel", label: "Excel 통합문서", support: "full" },
  { ext: "xlsm", type: "xlsx", app: "excel", label: "Excel 매크로", support: "full" },
  { ext: "xlsb", type: "xlsx", app: "excel", label: "Excel 이진", support: "full" },
  { ext: "xltx", type: "xlsx", app: "excel", label: "Excel 서식", support: "full" },
  { ext: "xltm", type: "xlsx", app: "excel", label: "Excel 매크로 서식", support: "full" },
  { ext: "xls", type: "xls", app: "excel", label: "Excel 97-2003", support: "full" },
  { ext: "xlt", type: "xls", app: "excel", label: "Excel 97-2003 서식", support: "partial" },
  { ext: "csv", type: "csv", app: "excel", label: "CSV", support: "full" },
  { ext: "ods", type: "ods", app: "excel", label: "OpenDocument 스프레드시트", support: "full" },
  { ext: "slk", type: "xlsx", app: "excel", label: "SYLK", support: "partial" },
  { ext: "dif", type: "csv", app: "excel", label: "DIF", support: "partial" },
  // PowerPoint
  { ext: "pptx", type: "presentation", app: "powerpoint", label: "PowerPoint", support: "full" },
  { ext: "pptm", type: "presentation", app: "powerpoint", label: "PowerPoint 매크로", support: "full" },
  { ext: "ppsx", type: "presentation", app: "powerpoint", label: "PowerPoint 쇼", support: "full" },
  { ext: "ppsm", type: "presentation", app: "powerpoint", label: "PowerPoint 매크로 쇼", support: "full" },
  { ext: "potx", type: "presentation", app: "powerpoint", label: "PowerPoint 서식", support: "full" },
  { ext: "potm", type: "presentation", app: "powerpoint", label: "PowerPoint 매크로 서식", support: "full" },
  { ext: "ppt", type: "presentation", app: "powerpoint", label: "PowerPoint 97-2003", support: "partial" },
  { ext: "pps", type: "presentation", app: "powerpoint", label: "PowerPoint 97-2003 쇼", support: "partial" },
  { ext: "odp", type: "presentation", app: "powerpoint", label: "OpenDocument 프레젠테이션", support: "full" },
  // PDF / Viewer
  { ext: "pdf", type: "pdf", app: "viewer", label: "PDF", support: "full" },
  // Images (OIS)
  { ext: "jpg", type: "image", app: "image", label: "JPEG", support: "full" },
  { ext: "jpeg", type: "image", app: "image", label: "JPEG", support: "full" },
  { ext: "jfif", type: "image", app: "image", label: "JPEG", support: "full" },
  { ext: "jpe", type: "image", app: "image", label: "JPEG", support: "full" },
  { ext: "png", type: "image", app: "image", label: "PNG", support: "full" },
  { ext: "gif", type: "image", app: "image", label: "GIF", support: "full" },
  { ext: "bmp", type: "image", app: "image", label: "BMP", support: "full" },
  { ext: "tif", type: "image", app: "image", label: "TIFF", support: "full" },
  { ext: "tiff", type: "image", app: "image", label: "TIFF", support: "full" },
  { ext: "dib", type: "image", app: "image", label: "DIB", support: "full" },
  { ext: "webp", type: "image", app: "image", label: "WebP", support: "full" },
  { ext: "svg", type: "image", app: "image", label: "SVG", support: "full" },
  { ext: "emf", type: "image", app: "image", label: "EMF", support: "partial" },
  { ext: "wmf", type: "image", app: "image", label: "WMF", support: "partial" },
  // 한글
  { ext: "hwp", type: "hwp", app: "viewer", label: "한글 HWP", support: "full" },
  { ext: "hwpx", type: "hwpx", app: "viewer", label: "한글 HWPX", support: "full" },
  // 7-Zip / 아카이브
  { ext: "7z", type: "archive", app: "viewer", label: "7-Zip", support: "full" },
  { ext: "zip", type: "archive", app: "viewer", label: "ZIP", support: "full" },
  { ext: "rar", type: "archive", app: "viewer", label: "RAR", support: "full" },
  { ext: "tar", type: "archive", app: "viewer", label: "TAR", support: "full" },
  { ext: "gz", type: "archive", app: "viewer", label: "GZIP", support: "full" },
  { ext: "tgz", type: "archive", app: "viewer", label: "TGZ", support: "full" },
  { ext: "bz2", type: "archive", app: "viewer", label: "BZIP2", support: "full" },
  { ext: "tbz2", type: "archive", app: "viewer", label: "TBZ2", support: "full" },
  { ext: "xz", type: "archive", app: "viewer", label: "XZ", support: "full" },
  { ext: "txz", type: "archive", app: "viewer", label: "TXZ", support: "full" },
  { ext: "wim", type: "archive", app: "viewer", label: "WIM", support: "full" },
  { ext: "iso", type: "archive", app: "viewer", label: "ISO", support: "full" },
  { ext: "cab", type: "archive", app: "viewer", label: "CAB", support: "full" },
  { ext: "deb", type: "archive", app: "viewer", label: "DEB", support: "full" },
  { ext: "rpm", type: "archive", app: "viewer", label: "RPM", support: "full" },
  { ext: "cpio", type: "archive", app: "viewer", label: "CPIO", support: "partial" },
  // 기타
  { ext: "md", type: "markdown", app: "viewer", label: "Markdown", support: "full" },
  { ext: "markdown", type: "markdown", app: "viewer", label: "Markdown", support: "full" },
  { ext: "json", type: "json", app: "viewer", label: "JSON", support: "full" },
  // Proprietary — metadata only
  { ext: "pub", type: "unsupported", app: "publisher", label: "Publisher", support: "metadata" },
  { ext: "vsd", type: "unsupported", app: "visio", label: "Visio", support: "metadata" },
  { ext: "vsdx", type: "unsupported", app: "visio", label: "Visio", support: "metadata" },
  { ext: "mdb", type: "unsupported", app: "access", label: "Access", support: "metadata" },
  { ext: "accdb", type: "unsupported", app: "access", label: "Access", support: "metadata" },
  { ext: "one", type: "unsupported", app: "onenote", label: "OneNote", support: "metadata" },
  { ext: "msg", type: "unsupported", app: "outlook", label: "Outlook 메일", support: "partial" },
  { ext: "eml", type: "mhtml", app: "outlook", label: "이메일 (EML)", support: "partial" },
];

export const EXT_TO_FORMAT = Object.fromEntries(
  MS_OFFICE_FORMATS.map((f) => [f.ext, f])
) as Record<string, FormatEntry>;

export function getOfficeAppForExt(ext: string): OfficeApp | null {
  return EXT_TO_FORMAT[ext.toLowerCase()]?.app ?? null;
}

export function countBySupport() {
  const full = MS_OFFICE_FORMATS.filter((f) => f.support === "full").length;
  const partial = MS_OFFICE_FORMATS.filter((f) => f.support === "partial").length;
  const meta = MS_OFFICE_FORMATS.filter((f) => f.support === "metadata").length;
  return { full, partial, metadata: meta, total: MS_OFFICE_FORMATS.length };
}
