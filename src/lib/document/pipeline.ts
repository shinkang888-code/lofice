/**
 * 통합 문서 수집 파이프라인 — HWP + MS Office
 */
import { getDocumentType } from "@/lib/document-types";
import { saveFileLocal } from "@/lib/storage/local";
import { getEditorRouteForSavedFile } from "@/lib/lofficeUi/routes";
import { detectHwpSecurityHint, type HwpSecurityHint } from "@/lib/document/hwp-detect";
import {
  isOfficeDocumentType,
  probeOfficeIngest,
  runOfficeBackgroundSync,
  type OfficeIngestMeta,
} from "@/lib/document/office-pipeline";
import { runHwpBackgroundSync } from "@/lib/document/hwp-pipeline";

export type IngestResult = {
  localId: string;
  route: string;
  format: string;
  securityHint: HwpSecurityHint | OfficeIngestMeta["securityHint"];
  normalizeStatus: "pending" | "ok" | "failed" | "skipped";
  needsOfficePassword?: boolean;
};

/** 파일 수집 — 로컬 저장 후 백그라운드 정규화·클라우드 동기화 */
export async function ingestDocument(file: File): Promise<IngestResult> {
  const format = getDocumentType(file.name);
  const localId = await saveFileLocal(file);
  const route = getEditorRouteForSavedFile(file.name, localId);

  if (format === "hwp" || format === "hwpx") {
    const buffer = await file.arrayBuffer();
    const securityHint = detectHwpSecurityHint(buffer, file.name);
    void runHwpBackgroundSync(localId, file, format, securityHint);
    return {
      localId,
      route,
      format,
      securityHint,
      normalizeStatus: format === "hwp" ? "pending" : "ok",
    };
  }

  if (isOfficeDocumentType(format)) {
    const office = await probeOfficeIngest(file);
    void runOfficeBackgroundSync(localId, file, format, office.securityHint);
    return {
      localId,
      route,
      format,
      securityHint: office.securityHint,
      normalizeStatus: office.normalizeStatus,
      needsOfficePassword: office.securityHint === "encrypted",
    };
  }

  return {
    localId,
    route,
    format,
    securityHint: "none",
    normalizeStatus: "skipped",
  };
}

export async function ingestDocumentWithNavigate(
  file: File,
  navigate: (path: string) => void,
): Promise<boolean> {
  const result = await ingestDocument(file);

  if (result.securityHint === "distribution") {
    const ok = confirm(
      "배포용(DRM) 한글 문서일 수 있습니다. 오픈소스 뷰어로는 완전 지원되지 않을 수 있습니다. 계속하시겠습니까?",
    );
    if (!ok) return false;
  }

  if (result.needsOfficePassword) {
    navigate(result.route);
    return true;
  }

  if (result.securityHint === "legacy") {
    const usePro = confirm(
      "레거시 Office 문서(.doc / .xls / .ppt)입니다.\n\nlofice Pro에서 LibreOffice 변환 후 사용하는 것을 권장합니다.\n\n[확인] Pro 변환 화면으로 이동\n[취소] 그대로 뷰어에서 열기",
    );
    if (usePro) {
      navigate(`/pro/?from=${encodeURIComponent(result.localId)}`);
      return true;
    }
  }

  navigate(result.route);
  return true;
}
