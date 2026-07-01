/** Loffice LibreOffice 엔진 (Collabora) 연동 설정 */

export const LOFFICE_ENGINE_STORAGE_KEY = "lofice-loffice-engine-url";

export const LOFFICE_ENGINE_EDITABLE_EXT = new Set([
  ".odt", ".ods", ".odp", ".odg",
  ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
  ".rtf", ".txt", ".csv",
]);

export const LOFFICE_ENGINE_DEFAULT_URL =
  process.env.NEXT_PUBLIC_LOFFICE_ENGINE_URL?.trim().replace(/\/+$/, "") ||
  "http://127.0.0.1:9982";

export function normalizeEngineUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return `${parsed.origin}${parsed.pathname}`.replace(/\/+$/, "") || parsed.origin;
  } catch {
    return null;
  }
}

export function getStoredEngineUrl(): string | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(LOFFICE_ENGINE_STORAGE_KEY);
  if (!raw) return null;
  return normalizeEngineUrl(raw);
}

export function saveStoredEngineUrl(url: string | null): string | null {
  if (typeof window === "undefined") return null;
  const normalized = url ? normalizeEngineUrl(url) : null;
  if (normalized) {
    localStorage.setItem(LOFFICE_ENGINE_STORAGE_KEY, normalized);
  } else {
    localStorage.removeItem(LOFFICE_ENGINE_STORAGE_KEY);
  }
  return normalized;
}

export function getLofficeEngineUrl(): string {
  return getStoredEngineUrl() || LOFFICE_ENGINE_DEFAULT_URL;
}

export function isLofficeEngineEditable(fileName: string): boolean {
  const ext = fileName.includes(".") ? fileName.slice(fileName.lastIndexOf(".")).toLowerCase() : "";
  return LOFFICE_ENGINE_EDITABLE_EXT.has(ext);
}
