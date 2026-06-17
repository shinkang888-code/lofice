/**
 * Canonical Document Model (CM) — HWPX 중심 정규 표현
 * @see docs/HWP_FULL_PORT_FEASIBILITY.md
 */

export type CanonicalFormat = "hwp" | "hwpx" | "docx" | "pdf" | "markdown";

export type CanonicalDocument = {
  localId: string;
  title: string;
  sourceFormat: CanonicalFormat;
  /** HWPX 정규 사본 (HWP 업로드 시 변환) */
  hwpxBuffer?: ArrayBuffer;
  /** RAG/AI용 */
  markdown?: string;
  /** 웹 뷰용 */
  html?: string;
  dvcScore?: number;
};

export type ConvertTarget = "hwpx" | "docx" | "markdown" | "pdf";

export function canonicalFileName(title: string, target: ConvertTarget): string {
  const base = title.replace(/\.[^.]+$/, "") || "document";
  const ext: Record<ConvertTarget, string> = {
    hwpx: ".hwpx",
    docx: ".docx",
    markdown: ".md",
    pdf: ".pdf",
  };
  return `${base}${ext[target]}`;
}
