/** lofice-14291513 FileOpener — 문서 타입 표시 */

export type DocTypeBadge = { label: string; icon: string; color: string };

export function getDocTypeBadge(name: string): DocTypeBadge {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["hwp", "hwpx"].includes(ext)) return { label: "한글", icon: "한", color: "bg-blue-500" };
  if (["xlsx", "xls", "csv"].includes(ext)) return { label: "시트", icon: "📊", color: "bg-green-600" };
  if (["ppt", "pptx", "odp"].includes(ext)) return { label: "슬라이드", icon: "🎞️", color: "bg-orange-500" };
  if (["doc", "docx"].includes(ext)) return { label: "워드", icon: "📝", color: "bg-sky-500" };
  if (ext === "pdf") return { label: "PDF", icon: "📄", color: "bg-red-500" };
  if (["zip", "7z", "rar", "tar", "gz"].includes(ext)) return { label: "아카이브", icon: "📦", color: "bg-amber-600" };
  return { label: "문서", icon: "📁", color: "bg-slate-500" };
}

export function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}
