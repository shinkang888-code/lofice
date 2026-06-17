import type { ProTargetFormat } from "./types";

const EXT_TARGETS: Record<string, ProTargetFormat[]> = {
  ".doc": ["docx", "pdf", "odt", "html"],
  ".dot": ["docx", "pdf", "odt", "html"],
  ".docx": ["pdf", "odt", "html"],
  ".docm": ["pdf", "docx"],
  ".odt": ["pdf", "docx", "html"],
  ".rtf": ["docx", "pdf", "odt"],
  ".xls": ["xlsx", "pdf"],
  ".xlt": ["xlsx", "pdf"],
  ".xlsx": ["pdf", "html"],
  ".xlsm": ["pdf", "xlsx"],
  ".ods": ["pdf", "xlsx"],
  ".csv": ["pdf", "xlsx"],
  ".ppt": ["pptx", "pdf"],
  ".pps": ["pptx", "pdf"],
  ".pot": ["pptx", "pdf"],
  ".pptx": ["pdf", "html"],
  ".pptm": ["pdf", "pptx"],
  ".odp": ["pdf", "pptx"],
  ".hwpx": ["docx", "pdf"],
  ".hwp": ["docx", "pdf"],
};

export const PRO_TARGET_LABELS: Record<ProTargetFormat, string> = {
  docx: "Word (DOCX)",
  xlsx: "Excel (XLSX)",
  pptx: "PowerPoint (PPTX)",
  pdf: "PDF",
  odt: "OpenDocument (ODT)",
  html: "HTML",
};

export function detectProExtension(fileName: string): string {
  const i = fileName.lastIndexOf(".");
  return i >= 0 ? fileName.slice(i).toLowerCase() : "";
}

export function getProTargetsForFile(fileName: string): ProTargetFormat[] {
  const ext = detectProExtension(fileName);
  return EXT_TARGETS[ext] ?? ["pdf", "docx", "html"];
}

export function getCommonProTargets(fileNames: string[]): ProTargetFormat[] {
  if (!fileNames.length) return ["pdf", "docx", "xlsx", "pptx", "odt", "html"];
  const sets = fileNames.map((n) => new Set(getProTargetsForFile(n)));
  const first = sets[0];
  const common = [...first].filter((t) => sets.every((s) => s.has(t)));
  return common.length ? common : ["pdf"];
}

export const PRO_ACCEPT =
  ".doc,.dot,.docx,.docm,.xls,.xlt,.xlsx,.xlsm,.ppt,.pps,.pot,.pptx,.pptm,.odt,.ods,.odp,.rtf,.csv,.hwpx,.hwp";

export function isProSupportedFile(fileName: string): boolean {
  const ext = detectProExtension(fileName);
  return ext in EXT_TARGETS;
}
