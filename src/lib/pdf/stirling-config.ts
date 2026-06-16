/** Stirling-PDF 서버 베이스 URL (예: https://pdf.example.com) */
export function getStirlingPdfUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_STIRLING_PDF_URL?.trim();
  if (!url) return null;
  return url.replace(/\/+$/, "");
}

export function isStirlingServerAvailable(): boolean {
  return Boolean(getStirlingPdfUrl());
}
