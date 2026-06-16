/**
 * LawyGo extractDocumentText.ts — lofice 클라이언트 전용
 * PDF: pdfjs 텍스트 → Tesseract OCR 폴백
 * 이미지: Tesseract OCR
 */
import { extractTextFromPdfBuffer } from "./pdfTextExtractClient";
import { ocrPdfBuffer, ocrImageBlob } from "./tesseractOcr";
import type { DocumentOcrResult } from "./types";
import { isImageMime, isPdfMime, needsOcrFallback } from "./types";

export const MAX_OCR_BYTES = 12 * 1024 * 1024;

export async function extractDocumentTextClient(
  buffer: ArrayBuffer,
  fileName: string,
  mimeType: string,
  onProgress?: (message: string, percent?: number) => void
): Promise<DocumentOcrResult> {
  if (buffer.byteLength > MAX_OCR_BYTES) {
    throw new Error("파일은 12MB 이하여야 합니다.");
  }

  const warnings: string[] = [];

  if (isPdfMime(mimeType, fileName)) {
    onProgress?.("PDF 텍스트 레이어 추출 중...", 10);
    let text = "";
    let pageCount = 0;

    try {
      const extracted = await extractTextFromPdfBuffer(buffer);
      text = extracted.text;
      pageCount = extracted.pageCount;
    } catch (e) {
      warnings.push("PDF 텍스트 레이어 추출 실패 — OCR로 전환합니다.");
    }

    if (!needsOcrFallback(text, pageCount)) {
      return { text, method: "pdf-text", pageCount, charCount: text.length, warnings };
    }

    warnings.push("스캔 PDF로 보입니다. Tesseract OCR을 실행합니다.");
    onProgress?.("Tesseract OCR 실행 중...", 30);

    const ocrText = await ocrPdfBuffer(buffer, (page, total) => {
      onProgress?.(`OCR ${page}/${total} 페이지`, 30 + Math.round((page / total) * 60));
    });

    if (ocrText.trim()) {
      return {
        text: ocrText,
        method: "tesseract",
        pageCount,
        charCount: ocrText.length,
        warnings,
      };
    }

    if (text.trim()) {
      warnings.push("OCR 결과가 비어 있어 PDF 텍스트 레이어를 사용합니다.");
      return { text, method: "pdf-text", pageCount, charCount: text.length, warnings };
    }

    throw new Error("PDF에서 텍스트를 추출하지 못했습니다.");
  }

  if (isImageMime(mimeType, fileName)) {
    onProgress?.("이미지 OCR 실행 중...", 20);
    const blob = new Blob([buffer], { type: mimeType.startsWith("image/") ? mimeType : "image/jpeg" });
    const text = await ocrImageBlob(blob);
    if (!text.trim()) throw new Error("이미지 OCR 결과가 비어 있습니다.");
    return { text, method: "tesseract", charCount: text.length, warnings };
  }

  throw new Error("PDF 또는 이미지(JPG, PNG, WEBP, TIFF)만 OCR 지원합니다.");
}
