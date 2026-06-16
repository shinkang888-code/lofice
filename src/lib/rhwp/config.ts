/** rhwp-studio URL — @rhwp/editor iframe 대상 (hwpreader 호환) */
export function getRhwpStudioUrl(): string {
  const url = process.env.NEXT_PUBLIC_RHWP_STUDIO_URL?.trim();
  if (url) return url.replace(/\/+$/, "") + "/";
  return "https://edwardkim.github.io/rhwp/";
}
