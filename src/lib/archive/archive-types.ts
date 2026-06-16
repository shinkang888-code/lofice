/** 7-Zip / 아카이브 형식 — ip7z/7zip 26.x 호환 */

export type ArchiveFormat =
  | "7z"
  | "zip"
  | "tar"
  | "gzip"
  | "bzip2"
  | "xz"
  | "wim"
  | "rar"
  | "iso"
  | "cab"
  | "deb"
  | "rpm"
  | "unknown";

export type ArchiveEntry = {
  path: string;
  size: number;
  packedSize?: number;
  isDir: boolean;
  modified?: string;
};

export type ArchiveListResult = {
  entries: ArchiveEntry[];
  format: ArchiveFormat;
  method: "7z-wasm" | "7zip-server" | "jszip";
};

export type ArchiveExtractResult = {
  files: { path: string; data: Uint8Array }[];
  method: "7z-wasm" | "7zip-server";
};

export type ArchiveCreateOptions = {
  format: "7z" | "zip" | "tar" | "gzip";
  level?: number;
  password?: string;
};

export const MAX_ARCHIVE_BYTES = 100 * 1024 * 1024;

export const ARCHIVE_COMPOUND_EXT: Record<string, ArchiveFormat> = {
  ".tar.gz": "gzip",
  ".tgz": "gzip",
  ".tar.bz2": "bzip2",
  ".tbz2": "bzip2",
  ".tar.xz": "xz",
  ".txz": "xz",
};

export const ARCHIVE_SINGLE_EXT: Record<string, ArchiveFormat> = {
  "7z": "7z",
  zip: "zip",
  rar: "rar",
  tar: "tar",
  gz: "gzip",
  bz2: "bzip2",
  xz: "xz",
  wim: "wim",
  iso: "iso",
  cab: "cab",
  deb: "deb",
  rpm: "rpm",
  cpio: "tar",
  arj: "unknown",
  lzh: "unknown",
  lzma: "xz",
};

export function detectArchiveFormat(fileName: string): ArchiveFormat {
  const lower = fileName.toLowerCase();
  for (const [ext, fmt] of Object.entries(ARCHIVE_COMPOUND_EXT)) {
    if (lower.endsWith(ext)) return fmt;
  }
  const single = lower.split(".").pop() ?? "";
  return ARCHIVE_SINGLE_EXT[single] ?? "unknown";
}

export function isArchiveFileName(fileName: string): boolean {
  return detectArchiveFormat(fileName) !== "unknown";
}

export const FORMAT_LABEL: Record<ArchiveFormat, string> = {
  "7z": "7-Zip (.7z)",
  zip: "ZIP",
  tar: "TAR",
  gzip: "GZIP",
  bzip2: "BZIP2",
  xz: "XZ",
  wim: "WIM",
  rar: "RAR",
  iso: "ISO",
  cab: "CAB",
  deb: "DEB",
  rpm: "RPM",
  unknown: "아카이브",
};

/** 7-Zip CLI 동등 기능 */
export const SEVEN_ZIP_OPERATIONS = [
  { id: "list", label: "목록 (l)", desc: "아카이브 내 파일 목록" },
  { id: "extract", label: "압축 풀기 (x)", desc: "선택/전체 추출" },
  { id: "extract-e", label: "추출 (e)", desc: "경로 없이 파일만 추출" },
  { id: "test", label: "테스트 (t)", desc: "무결성 검사" },
  { id: "add", label: "압축 (a)", desc: "새 아카이브 생성" },
  { id: "update", label: "갱신 (u)", desc: "기존 아카이브에 추가" },
] as const;

export type SevenZipOperationId = (typeof SEVEN_ZIP_OPERATIONS)[number]["id"];
