/** ddddocr API 서버 베이스 URL (예: http://localhost:8000) */
export function getDdddOcrUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_DDDDOCR_URL?.trim();
  if (!url) return null;
  return url.replace(/\/+$/, "");
}

export function isDdddOcrServerAvailable(): boolean {
  return Boolean(getDdddOcrUrl());
}
