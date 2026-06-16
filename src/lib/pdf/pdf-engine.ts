import type { PDFDocumentProxy } from "pdfjs-dist";

let pdfjsModule: typeof import("pdfjs-dist") | null = null;
let loadPromise: Promise<typeof import("pdfjs-dist")> | null = null;

/** pdfjs-dist + worker를 앱 시작 시 1회만 로드 (매 문서마다 dynamic import 방지) */
export function preloadPdfEngine(): Promise<typeof import("pdfjs-dist")> {
  if (loadPromise) return loadPromise;
  loadPromise = import("pdfjs-dist").then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    pdfjsModule = pdfjs;
    return pdfjs;
  });
  return loadPromise;
}

export async function getPdfJs() {
  return pdfjsModule ?? preloadPdfEngine();
}

export function toPdfBytes(buffer: ArrayBuffer): Uint8Array {
  return new Uint8Array(buffer);
}

export async function openPdfDocument(buffer: ArrayBuffer): Promise<PDFDocumentProxy> {
  const pdfjs = await getPdfJs();
  const loadingTask = pdfjs.getDocument({
    data: toPdfBytes(buffer),
    useSystemFonts: true,
    disableAutoFetch: false,
    disableStream: false,
    isEvalSupported: false,
    useWorkerFetch: false,
  });
  return loadingTask.promise;
}

/** 컨테이너 너비에 맞춘 스케일 (고정 1.5 배율보다 빠르고 선명) */
export function fitScale(pageWidth: number, containerWidth: number, padding = 32): number {
  const available = Math.max(200, containerWidth - padding);
  return Math.min(2, Math.max(0.5, available / pageWidth));
}
