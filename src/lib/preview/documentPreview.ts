/** LawyGo pdfPreview.ts — lofice IndexedDB 연동 */

export const PREVIEW_STORAGE_KEY = "lofice_preview";

export type PreviewPayload = {
  id: string;
  fileName: string;
  mimeType: string;
};

export function isPdfMime(mimeType?: string, fileName?: string): boolean {
  if (mimeType?.includes("pdf")) return true;
  return (fileName ?? "").toLowerCase().endsWith(".pdf");
}

export function isPreviewableMime(mimeType?: string, fileName?: string): boolean {
  if (!mimeType && !fileName) return false;
  if (isPdfMime(mimeType, fileName)) return true;
  if (mimeType?.startsWith("image/")) return true;
  if (mimeType?.startsWith("text/")) return true;
  const ext = (fileName ?? "").split(".").pop()?.toLowerCase() ?? "";
  return ["docx", "doc", "xlsx", "xls", "hwp", "hwpx", "pptx", "txt", "md", "html"].includes(ext);
}

export function openFilePreview(payload: PreviewPayload, tab?: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(payload));
  const qs = tab ? `&tab=${tab}` : "";
  const url = `/preview/?id=${encodeURIComponent(payload.id)}${qs}`;
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  if (isMobile) {
    window.location.href = url;
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer,width=960,height=820");
}

export function openFilePreviewById(id: string, fileName: string, mimeType = "", tab?: string): void {
  openFilePreview({ id, fileName, mimeType }, tab);
}
