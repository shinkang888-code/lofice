import { getStoredProApiUrl } from "@/lib/pro/settings";

const DEFAULT =
  process.env.NEXT_PUBLIC_OFFICE_CONVERT_DEFAULT_URL?.trim() ||
  "https://lofice-office-convert.vercel.app";

export type OfficeConvertSource = "stored" | "env" | "default" | "none";

function envOfficeConvertUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_OFFICE_CONVERT_URL?.trim();
  if (!url) return null;
  return url.replace(/\/+$/, "");
}

/** 브라우저: localStorage UI 입력 → env → default */
export function getOfficeConvertUrl(): string | null {
  const stored = getStoredProApiUrl();
  if (stored) return stored;
  const fromEnv = envOfficeConvertUrl();
  if (fromEnv) return fromEnv;
  return DEFAULT.replace(/\/+$/, "") || null;
}

export function getOfficeConvertSource(): OfficeConvertSource {
  if (getStoredProApiUrl()) return "stored";
  if (envOfficeConvertUrl()) return "env";
  if (DEFAULT) return "default";
  return "none";
}

export function isOfficeConvertAvailable(): boolean {
  return Boolean(getOfficeConvertUrl());
}
