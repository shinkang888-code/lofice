const DEFAULT =
  process.env.NEXT_PUBLIC_OFFICE_CONVERT_DEFAULT_URL?.trim() ||
  "https://lofice-office-convert.vercel.app";

export function getOfficeConvertUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_OFFICE_CONVERT_URL?.trim() || DEFAULT;
  if (!url) return null;
  return url.replace(/\/+$/, "");
}

export function isOfficeConvertAvailable(): boolean {
  return Boolean(getOfficeConvertUrl());
}
