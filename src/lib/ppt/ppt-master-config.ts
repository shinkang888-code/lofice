/** PPT Master viewer/embed 베이스 URL */
export function getPptMasterUrl(): string {
  const url = process.env.NEXT_PUBLIC_PPT_MASTER_URL?.trim();
  if (url) return url.replace(/\/+$/, "");
  return "https://hugohe3.github.io/ppt-master";
}

export function getPptMasterViewerUrl(projectId?: string): string {
  const base = getPptMasterUrl();
  if (projectId) return `${base}/viewer.html?project=${encodeURIComponent(projectId)}`;
  return `${base}/viewer.html`;
}
