/**
 * Stirling-PDF 호환 클라이언트 PDF 도구 (pdf-lib)
 * @see https://github.com/Stirling-Tools/Stirling-PDF
 */
import { PDFDocument, degrees } from "pdf-lib";
import { parsePageRange } from "./page-range";

export type StirlingToolResult =
  | { kind: "pdf"; bytes: Uint8Array; fileName: string }
  | { kind: "zip"; blobs: { name: string; bytes: Uint8Array }[]; zipName: string };

async function loadPdf(bytes: ArrayBuffer | Uint8Array): Promise<PDFDocument> {
  const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return PDFDocument.load(data, { ignoreEncryption: true });
}

async function savePdf(doc: PDFDocument, fileName: string): Promise<StirlingToolResult> {
  const out = await doc.save();
  return { kind: "pdf", bytes: out, fileName };
}

/** /api/v1/general/merge-pdfs */
export async function mergePdfs(
  files: { bytes: ArrayBuffer | Uint8Array; name: string }[],
  outputName = "merged.pdf",
): Promise<StirlingToolResult> {
  if (files.length < 2) throw new Error("병합하려면 PDF 2개 이상이 필요합니다.");

  const merged = await PDFDocument.create();
  for (const file of files) {
    const src = await loadPdf(file.bytes);
    const indices = src.getPageIndices();
    const copied = await merged.copyPages(src, indices);
    copied.forEach((page) => merged.addPage(page));
  }
  return savePdf(merged, outputName);
}

/** /api/v1/general/rotate-pdf — angle: 90 | 180 | 270 */
export async function rotatePdf(
  bytes: ArrayBuffer | Uint8Array,
  angle: 90 | 180 | 270,
  fileName: string,
): Promise<StirlingToolResult> {
  const doc = await loadPdf(bytes);
  const pages = doc.getPages();
  for (const page of pages) {
    const current = page.getRotation().angle;
    page.setRotation(degrees((current + angle) % 360));
  }
  const base = fileName.replace(/\.pdf$/i, "");
  return savePdf(doc, `${base}_rotated.pdf`);
}

/** /api/v1/general/split-pages — 페이지별 개별 PDF */
export async function splitPdfByPages(
  bytes: ArrayBuffer | Uint8Array,
  pageSpec: string,
  fileName: string,
): Promise<StirlingToolResult> {
  const src = await loadPdf(bytes);
  const total = src.getPageCount();
  const pageNumbers = parsePageRange(pageSpec, total);
  if (pageNumbers.length === 0) throw new Error("유효한 페이지 범위가 없습니다.");

  const base = fileName.replace(/\.pdf$/i, "");
  const blobs: { name: string; bytes: Uint8Array }[] = [];

  for (const pageNum of pageNumbers) {
    const out = await PDFDocument.create();
    const [page] = await out.copyPages(src, [pageNum - 1]);
    out.addPage(page);
    blobs.push({
      name: `${base}_page_${pageNum}.pdf`,
      bytes: await out.save(),
    });
  }

  return { kind: "zip", blobs, zipName: `${base}_split.zip` };
}

/** 선택 페이지만 추출해 단일 PDF */
export async function extractPages(
  bytes: ArrayBuffer | Uint8Array,
  pageSpec: string,
  fileName: string,
): Promise<StirlingToolResult> {
  const src = await loadPdf(bytes);
  const total = src.getPageCount();
  const pageNumbers = parsePageRange(pageSpec, total);
  if (pageNumbers.length === 0) throw new Error("추출할 페이지를 선택하세요.");

  const out = await PDFDocument.create();
  const indices = pageNumbers.map((p) => p - 1);
  const copied = await out.copyPages(src, indices);
  copied.forEach((page) => out.addPage(page));

  const base = fileName.replace(/\.pdf$/i, "");
  return savePdf(out, `${base}_extracted.pdf`);
}

/** 선택 페이지 삭제 */
export async function deletePages(
  bytes: ArrayBuffer | Uint8Array,
  pageSpec: string,
  fileName: string,
): Promise<StirlingToolResult> {
  const src = await loadPdf(bytes);
  const total = src.getPageCount();
  const toRemove = new Set(parsePageRange(pageSpec, total));
  if (toRemove.size === 0) throw new Error("삭제할 페이지를 선택하세요.");
  if (toRemove.size >= total) throw new Error("모든 페이지를 삭제할 수 없습니다.");

  const out = await PDFDocument.create();
  const keep = Array.from({ length: total }, (_, i) => i).filter((i) => !toRemove.has(i + 1));
  const copied = await out.copyPages(src, keep);
  copied.forEach((page) => out.addPage(page));

  const base = fileName.replace(/\.pdf$/i, "");
  return savePdf(out, `${base}_edited.pdf`);
}

/** 페이지 순서 재배열 (1-based) */
export async function reorderPages(
  bytes: ArrayBuffer | Uint8Array,
  newOrder: number[],
  fileName: string,
): Promise<StirlingToolResult> {
  const src = await loadPdf(bytes);
  const total = src.getPageCount();
  if (newOrder.length !== total) throw new Error("페이지 순서가 올바르지 않습니다.");

  const out = await PDFDocument.create();
  const indices = newOrder.map((p) => {
    if (p < 1 || p > total) throw new Error(`잘못된 페이지 번호: ${p}`);
    return p - 1;
  });
  const copied = await out.copyPages(src, indices);
  copied.forEach((page) => out.addPage(page));

  const base = fileName.replace(/\.pdf$/i, "");
  return savePdf(out, `${base}_reordered.pdf`);
}

export async function getPdfPageCount(bytes: ArrayBuffer | Uint8Array): Promise<number> {
  const doc = await loadPdf(bytes);
  return doc.getPageCount();
}

/** ZIP 다운로드용 (JSZip 없이 간단 blob) */
export async function packZip(files: { name: string; bytes: Uint8Array }[]): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  for (const f of files) zip.file(f.name, f.bytes);
  return zip.generateAsync({ type: "blob" });
}

export function downloadBytes(bytes: Uint8Array, fileName: string, mime = "application/pdf") {
  const ab = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const blob = new Blob([ab], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadStirlingResult(result: StirlingToolResult) {
  if (result.kind === "pdf") {
    downloadBytes(result.bytes, result.fileName);
    return;
  }
  const zipBlob = await packZip(result.blobs);
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = result.zipName;
  a.click();
  URL.revokeObjectURL(url);
}
