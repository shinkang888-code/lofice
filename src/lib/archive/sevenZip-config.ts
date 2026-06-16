/** 7-Zip 네이티브 CLI API (선택) — Docker/Electron */
export function getSevenZipServerUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_7ZIP_URL?.trim();
  if (!url) return null;
  return url.replace(/\/+$/, "");
}

export function isSevenZipServerAvailable(): boolean {
  return Boolean(getSevenZipServerUrl());
}
