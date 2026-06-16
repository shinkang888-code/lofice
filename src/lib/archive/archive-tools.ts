/**
 * 통합 아카이브 도구 — 7z-wasm + JSZip(zip) + 선택적 7zip 서버
 */
import JSZip from "jszip";
import type {
  ArchiveCreateOptions,
  ArchiveExtractResult,
  ArchiveListResult,
} from "./archive-types";
import { MAX_ARCHIVE_BYTES, detectArchiveFormat } from "./archive-types";
import { getSevenZipServerUrl, isSevenZipServerAvailable } from "./sevenZip-config";
import {
  sevenZipCreate,
  sevenZipExtract,
  sevenZipList,
  sevenZipTest,
} from "./sevenZip-engine";

function assertSize(buffer: ArrayBuffer): void {
  if (buffer.byteLength > MAX_ARCHIVE_BYTES) {
    throw new Error(`아카이브는 ${MAX_ARCHIVE_BYTES / (1024 * 1024)}MB 이하여야 합니다.`);
  }
}

async function listZipWithJsZip(buffer: ArrayBuffer): Promise<ArchiveListResult> {
  const zip = await JSZip.loadAsync(buffer);
  const entries = Object.entries(zip.files).map(([name, f]) => ({
    path: name,
    size: 0,
    isDir: f.dir,
  }));
  return { entries: entries.filter((e) => !e.isDir && e.path), format: "zip", method: "jszip" };
}

async function extractZipWithJsZip(buffer: ArrayBuffer, paths?: string[]): Promise<ArchiveExtractResult> {
  const zip = await JSZip.loadAsync(buffer);
  const files: { path: string; data: Uint8Array }[] = [];
  const names = paths?.length ? paths : Object.keys(zip.files);

  for (const name of names) {
    const entry = zip.file(name);
    if (!entry || entry.dir) continue;
    const data = await entry.async("uint8array");
    files.push({ path: name, data });
  }
  return { files, method: "7z-wasm" };
}

export async function archiveList(buffer: ArrayBuffer, fileName: string): Promise<ArchiveListResult> {
  assertSize(buffer);
  const fmt = detectArchiveFormat(fileName);

  if (fmt === "zip" && buffer.byteLength < 32 * 1024 * 1024) {
    try {
      return await listZipWithJsZip(buffer);
    } catch {
      /* fall through to 7z */
    }
  }

  return sevenZipList(buffer, fileName);
}

export async function archiveExtract(
  buffer: ArrayBuffer,
  fileName: string,
  paths?: string[],
): Promise<ArchiveExtractResult> {
  assertSize(buffer);
  const fmt = detectArchiveFormat(fileName);

  if (fmt === "zip" && !paths?.some((p) => !p.endsWith(".zip"))) {
    try {
      return await extractZipWithJsZip(buffer, paths);
    } catch {
      /* 7z fallback */
    }
  }

  return sevenZipExtract(buffer, fileName, paths);
}

export async function archiveTest(buffer: ArrayBuffer, fileName: string): Promise<void> {
  assertSize(buffer);
  await sevenZipTest(buffer, fileName);
}

export async function archiveCreate(
  files: { path: string; data: Uint8Array }[],
  outputName: string,
  options: ArchiveCreateOptions = { format: "7z", level: 5 },
): Promise<Uint8Array> {
  if (options.format === "zip" && files.length <= 50) {
    const zip = new JSZip();
    for (const f of files) zip.file(f.path, f.data);
    const ab = await zip.generateAsync({
      type: "arraybuffer",
      compression: "DEFLATE",
      compressionOptions: { level: Math.min(9, options.level ?? 6) },
    });
    return new Uint8Array(ab);
  }

  return sevenZipCreate(files, outputName, options.format, options.level ?? 5);
}

export async function archiveDownloadBlob(data: Uint8Array, fileName: string): Promise<void> {
  const blob = new Blob([data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export async function archivePackExtractedZip(
  files: { path: string; data: Uint8Array }[],
  zipName: string,
): Promise<void> {
  const zip = new JSZip();
  for (const f of files) zip.file(f.path, f.data);
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = zipName;
  a.click();
  URL.revokeObjectURL(url);
}

export { isSevenZipServerAvailable, getSevenZipServerUrl };
