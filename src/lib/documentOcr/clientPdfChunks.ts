/** LawyGo clientPdfChunks.ts — 대용량 PDF 구간 분할 */
import { PDFDocument } from "pdf-lib";

export const PDF_OCR_PAGES_PER_CHUNK = 5;
export const PDF_OCR_MAX_PAGES = 30;

export type PdfUploadChunk = {
  name: string;
  data: Uint8Array;
  pageFrom: number;
  pageTo: number;
};

export async function splitPdfIntoChunks(
  fileBuffer: ArrayBuffer,
  fileName: string,
  pagesPerChunk = PDF_OCR_PAGES_PER_CHUNK
): Promise<PdfUploadChunk[]> {
  const src = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const totalPages = Math.min(src.getPageCount(), PDF_OCR_MAX_PAGES);
  const baseName = fileName.replace(/\.pdf$/i, "") || "document";
  const chunks: PdfUploadChunk[] = [];

  for (let start = 1; start <= totalPages; start += pagesPerChunk) {
    const end = Math.min(start + pagesPerChunk - 1, totalPages);
    const indices: number[] = [];
    for (let p = start; p <= end; p++) indices.push(p - 1);

    const dst = await PDFDocument.create();
    const copied = await dst.copyPages(src, indices);
    for (const page of copied) dst.addPage(page);
    const bytes = await dst.save();

    chunks.push({
      name: `${baseName}_p${start}-${end}.pdf`,
      data: bytes,
      pageFrom: start,
      pageTo: end,
    });
  }

  return chunks;
}
