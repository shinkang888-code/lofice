import { isLegacyOfficeFormat } from "@/lib/document/office-canonical-model";
import { detectProExtension, isProSupportedFile } from "./formats";

export type ProRecommendReason = "legacy-office" | "hwpx" | "odf" | "complex-office";

const REASON_COPY: Record<ProRecommendReason, { title: string; desc: string }> = {
  "legacy-office": {
    title: "레거시 Office 문서",
    desc: ".doc · .xls · .ppt — 브라우저 뷰어 한계. Pro LibreOffice 변환 권장.",
  },
  hwpx: {
    title: "한글 HWP/HWPX",
    desc: "DOCX/PDF 고품질 변환은 lofice Pro 엔진이 더 정확합니다.",
  },
  odf: {
    title: "OpenDocument",
    desc: "ODT/ODS/ODP → Office·PDF 변환은 Pro가 호환성이 높습니다.",
  },
  "complex-office": {
    title: "고호환 변환",
    desc: "복잡한 서식·레이아웃은 Pro LibreOffice 엔진을 사용하세요.",
  },
};

export function getProRecommendReason(fileName: string): ProRecommendReason | null {
  if (isLegacyOfficeFormat(fileName)) return "legacy-office";
  const ext = detectProExtension(fileName);
  if (ext === ".hwpx" || ext === ".hwp") return "hwpx";
  if (ext === ".odt" || ext === ".ods" || ext === ".odp") return "odf";
  return null;
}

export function shouldSuggestPro(fileName: string): boolean {
  return getProRecommendReason(fileName) !== null || isProSupportedFile(fileName);
}

export function getProRecommendCopy(fileName: string): { title: string; desc: string } | null {
  const reason = getProRecommendReason(fileName);
  if (!reason) {
    if (isProSupportedFile(fileName)) return REASON_COPY["complex-office"];
    return null;
  }
  return REASON_COPY[reason];
}

export function buildProRouteFromFile(localId: string, target?: string): string {
  const base = `/pro/?from=${encodeURIComponent(localId)}`;
  return target ? `${base}&target=${target}` : base;
}
