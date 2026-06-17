/** lofice Pro — API URL 사용자 설정 (UI 직접 입력, Docker/env 불필요) */

export const PRO_API_STORAGE_KEY = "lofice-pro-api-url";

export const PRO_API_PRESETS = [
  { id: "render", label: "Render Pro API", url: "https://lofice-pro-api.onrender.com" },
  { id: "local", label: "로컬 Pro API", url: "http://localhost:8200" },
  { id: "vercel", label: "Vercel Pro API (fallback)", url: "https://lofice-office-convert.vercel.app" },
] as const;

export const PRO_API_URL_CHANGED = "lofice:proApiUrlChanged";

export function normalizeProApiUrl(raw: string): string | null {
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

export function getStoredProApiUrl(): string | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PRO_API_STORAGE_KEY);
  if (!raw) return null;
  return normalizeProApiUrl(raw);
}

export function saveStoredProApiUrl(url: string | null): string | null {
  if (typeof window === "undefined") return null;
  const normalized = url ? normalizeProApiUrl(url) : null;
  if (normalized) {
    localStorage.setItem(PRO_API_STORAGE_KEY, normalized);
  } else {
    localStorage.removeItem(PRO_API_STORAGE_KEY);
  }
  window.dispatchEvent(new CustomEvent(PRO_API_URL_CHANGED, { detail: { url: normalized } }));
  return normalized;
}

export function clearStoredProApiUrl(): void {
  saveStoredProApiUrl(null);
}
