/**
 * MS Office 수집 파이프라인 — Phase 1~3
 * 로컬 저장 → Supabase 이중 저장 → 레거시 OOXML 정규화 → ooxml-lite 검증
 */
import { getDocumentType } from "@/lib/document-types";
import { updateFileLocal } from "@/lib/storage/local";
import {
  canonicalFileName,
  isLegacyOfficeFormat,
  isOoxmlFormat,
  targetOoxmlFormat,
  type OfficeCanonicalFormat,
} from "@/lib/document/office-canonical-model";
import { detectOfficeSecurityHint, type OfficeSecurityHint } from "@/lib/document/office-detect";
import { validateOoxmlLite } from "@/lib/document/office-ooxml-validate";
import {
  base64ToArrayBuffer,
  isOfficeConvertAvailable,
  normalizeOfficeDocument,
} from "@/lib/convert/office-normalize";
import {
  isSupabaseConfigured,
  uploadDocumentBlob,
  upsertDocumentMeta,
} from "@/lib/supabase/document-storage";

export type OfficeIngestMeta = {
  securityHint: OfficeSecurityHint;
  normalizeStatus: "pending" | "ok" | "failed" | "skipped";
};

const OFFICE_TYPES = new Set([
  "docx", "doc", "xlsx", "xls", "csv", "presentation", "odt", "ods", "odp",
]);

export function isOfficeDocumentType(format: string): boolean {
  return OFFICE_TYPES.has(format);
}

async function normalizeOffice(
  buffer: ArrayBuffer,
  fileName: string,
): Promise<{ buffer: ArrayBuffer; fileName: string; format: OfficeCanonicalFormat } | null> {
  const target = targetOoxmlFormat(fileName);
  if (!target) return null;

  if (isOoxmlFormat(fileName) && !isLegacyOfficeFormat(fileName)) {
    return { buffer, fileName, format: target };
  }

  if (!isOfficeConvertAvailable()) return null;

  try {
    const result = await normalizeOfficeDocument(buffer, fileName);
    return {
      buffer: base64ToArrayBuffer(result.data_base64),
      fileName: result.file_name,
      format: result.format,
    };
  } catch (e) {
    console.warn("[office-pipeline] normalize failed", e);
    return null;
  }
}

export async function runOfficeBackgroundSync(
  localId: string,
  file: File,
  format: string,
  securityHint: OfficeSecurityHint,
): Promise<void> {
  if (!isOfficeDocumentType(format)) return;

  const buffer = await file.arrayBuffer();
  let normalizeStatus: OfficeIngestMeta["normalizeStatus"] = "skipped";
  let normalizeError: string | null = null;
  let canonicalPath: string | null = null;
  let ooxmlScore: number | null = null;
  let ooxmlReport: Record<string, unknown> | null = null;
  let canonicalDocx: string | null = null;
  let canonicalXlsx: string | null = null;
  let canonicalPptx: string | null = null;

  if (isSupabaseConfigured()) {
    await uploadDocumentBlob(localId, "original", buffer, file.name);
  }

  const needsNormalize =
    securityHint === "legacy" ||
    (securityHint === "none" && isLegacyOfficeFormat(file.name));

  if (needsNormalize) {
    const normalized = await normalizeOffice(buffer, file.name);
    if (normalized) {
      try {
        await updateFileLocal(localId, normalized.buffer, normalized.fileName);
        normalizeStatus = "ok";
        const validation = await validateOoxmlLite(normalized.buffer);
        ooxmlScore = validation.score;
        ooxmlReport = validation.report;

        if (isSupabaseConfigured()) {
          const suffix =
            normalized.format === "docx"
              ? "canonical.docx"
              : normalized.format === "xlsx"
                ? "canonical.xlsx"
                : "canonical.pptx";
          canonicalPath = await uploadDocumentBlob(
            localId,
            suffix,
            normalized.buffer,
            canonicalFileName(file.name, normalized.format),
          );
          if (normalized.format === "docx") canonicalDocx = canonicalPath;
          if (normalized.format === "xlsx") canonicalXlsx = canonicalPath;
          if (normalized.format === "pptx") canonicalPptx = canonicalPath;
        }
      } catch (e) {
        normalizeStatus = "failed";
        normalizeError = e instanceof Error ? e.message : "normalize failed";
      }
    } else if (isLegacyOfficeFormat(file.name)) {
      normalizeStatus = "failed";
      normalizeError = "레거시 Office 정규화 실패 (office-convert-api 필요)";
    }
  } else if (isOoxmlFormat(file.name) && securityHint === "none") {
    normalizeStatus = "ok";
    const validation = await validateOoxmlLite(buffer);
    ooxmlScore = validation.score;
    ooxmlReport = validation.report;
    const target = targetOoxmlFormat(file.name);
    if (target && isSupabaseConfigured()) {
      const suffix =
        target === "docx" ? "canonical.docx" : target === "xlsx" ? "canonical.xlsx" : "canonical.pptx";
      canonicalPath = await uploadDocumentBlob(localId, suffix, buffer, file.name);
      if (target === "docx") canonicalDocx = canonicalPath;
      if (target === "xlsx") canonicalXlsx = canonicalPath;
      if (target === "pptx") canonicalPptx = canonicalPath;
    }
  }

  if (isSupabaseConfigured()) {
    await upsertDocumentMeta({
      local_id: localId,
      file_name: file.name,
      format,
      mime_type: file.type,
      original_storage_path: `${localId}/original.${file.name.split(".").pop() ?? "bin"}`,
      canonical_hwpx_path: null,
      canonical_docx_path: canonicalDocx,
      canonical_xlsx_path: canonicalXlsx,
      canonical_pptx_path: canonicalPptx,
      dvc_score: ooxmlScore,
      dvc_report: ooxmlReport,
      normalize_status: normalizeStatus,
      normalize_error: normalizeError,
      size_bytes: file.size,
    });
  }
}

export async function probeOfficeIngest(file: File): Promise<OfficeIngestMeta> {
  const format = getDocumentType(file.name);
  if (!isOfficeDocumentType(format)) {
    return { securityHint: "none", normalizeStatus: "skipped" };
  }
  const buffer = await file.arrayBuffer();
  const securityHint = await detectOfficeSecurityHint(buffer, file.name);
  let normalizeStatus: OfficeIngestMeta["normalizeStatus"] = "skipped";
  if (securityHint === "legacy") normalizeStatus = "pending";
  else if (isOoxmlFormat(file.name)) normalizeStatus = "ok";
  return { securityHint, normalizeStatus };
}
