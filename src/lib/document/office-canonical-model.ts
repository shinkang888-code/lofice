/**
 * Office Canonical Document Model (CM)
 * @see docs/MSOFFICE_FULL_PORT_FEASIBILITY.md
 */

export type OfficeCanonicalFormat = "docx" | "xlsx" | "pptx";

export type OfficeSourceFormat =
  | OfficeCanonicalFormat
  | "doc"
  | "xls"
  | "ppt"
  | "pps"
  | "docm"
  | "xlsm"
  | "pptm"
  | "odt"
  | "ods"
  | "odp";

export type OfficeCryptoState = "none" | "encrypted" | "decrypted";

export type OfficeCanonicalDocument = {
  localId: string;
  title: string;
  sourceFormat: OfficeSourceFormat;
  canonicalFormat?: OfficeCanonicalFormat;
  ooxmlBuffer?: ArrayBuffer;
  markdown?: string;
  html?: string;
  crypto?: OfficeCryptoState;
  ooxmlScore?: number;
};

const LEGACY_TO_OOXML: Record<string, OfficeCanonicalFormat> = {
  doc: "docx",
  xls: "xlsx",
  ppt: "pptx",
  pps: "pptx",
};

const OOXML_EXTS = new Set(["docx", "xlsx", "pptx", "docm", "xlsm", "pptm"]);

export function extOf(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

export function isOoxmlFormat(fileName: string): boolean {
  return OOXML_EXTS.has(extOf(fileName));
}

export function isLegacyOfficeFormat(fileName: string): boolean {
  return extOf(fileName) in LEGACY_TO_OOXML;
}

export function targetOoxmlFormat(fileName: string): OfficeCanonicalFormat | null {
  const ext = extOf(fileName);
  if (OOXML_EXTS.has(ext)) {
    if (ext === "docm") return "docx";
    if (ext === "xlsm") return "xlsx";
    if (ext === "pptm") return "pptx";
    return ext as OfficeCanonicalFormat;
  }
  return LEGACY_TO_OOXML[ext] ?? null;
}

export function canonicalFileName(title: string, format: OfficeCanonicalFormat): string {
  const base = title.replace(/\.[^.]+$/, "") || "document";
  return `${base}.${format}`;
}
