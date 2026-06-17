/**
 * HWP 수집 백그라운드 동기화 (pipeline에서 분리)
 */
import { updateFileLocal } from "@/lib/storage/local";
import { detectHwpSecurityHint, type HwpSecurityHint } from "@/lib/document/hwp-detect";
import {
  isSupabaseConfigured,
  uploadDocumentBlob,
  upsertDocumentMeta,
} from "@/lib/supabase/document-storage";
import {
  hwpxSkillConvertHwp,
  hwpxSkillValidateDvc,
  checkHwpxSkillHealth,
} from "@/lib/hwpxSkill/api";
import { isHwpxSkillServerAvailable } from "@/lib/hwpxSkill/config";
import { parseHancomDocument, saveHancomAsHwpxFromText } from "@/lib/parsers/hancom";

async function normalizeHwpClientSide(buffer: ArrayBuffer, fileName: string): Promise<ArrayBuffer | null> {
  try {
    const result = await parseHancomDocument(buffer);
    if (result.format === "hwpx") return buffer;
    const { hwpToHwpx } = await import("@ssabrojs/hwpxjs");
    const bytes = new Uint8Array(buffer);
    try {
      const hwpx = await hwpToHwpx(bytes);
      return hwpx.buffer.slice(hwpx.byteOffset, hwpx.byteOffset + hwpx.byteLength) as ArrayBuffer;
    } catch {
      return saveHancomAsHwpxFromText(result.text || " ", fileName.replace(/\.[^.]+$/, ""));
    }
  } catch {
    return null;
  }
}

async function normalizeHwp(buffer: ArrayBuffer, fileName: string): Promise<ArrayBuffer | null> {
  if (isHwpxSkillServerAvailable()) {
    try {
      const health = await checkHwpxSkillHealth();
      if (health?.skill_ready) {
        const converted = await hwpxSkillConvertHwp(buffer, fileName);
        const binary = atob(converted.data_base64);
        const out = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
        return out.buffer;
      }
    } catch (e) {
      console.warn("[hwp-pipeline] server normalize failed", e);
    }
  }
  return normalizeHwpClientSide(buffer, fileName);
}

export async function runHwpBackgroundSync(
  localId: string,
  file: File,
  format: string,
  securityHint: HwpSecurityHint,
): Promise<void> {
  const buffer = await file.arrayBuffer();
  let normalizeStatus: "pending" | "ok" | "failed" | "skipped" = "skipped";
  let canonicalPath: string | null = null;
  let dvcScore: number | null = null;
  let dvcReport: Record<string, unknown> | null = null;
  let normalizeError: string | null = null;

  if (isSupabaseConfigured()) {
    await uploadDocumentBlob(localId, "original", buffer, file.name);
  }

  if (format === "hwp" && securityHint === "none") {
    const hwpx = await normalizeHwp(buffer, file.name);
    if (hwpx) {
      try {
        await updateFileLocal(localId, hwpx, file.name.replace(/\.hwp$/i, ".hwpx"));
        normalizeStatus = "ok";
        if (isSupabaseConfigured()) {
          canonicalPath = await uploadDocumentBlob(localId, "canonical.hwpx", hwpx, "canonical.hwpx");
        }
        if (isHwpxSkillServerAvailable()) {
          try {
            const dvc = await hwpxSkillValidateDvc(hwpx, "canonical.hwpx");
            dvcScore = dvc.score;
            dvcReport = dvc.report;
          } catch {
            /* optional */
          }
        }
      } catch (e) {
        normalizeStatus = "failed";
        normalizeError = e instanceof Error ? e.message : "normalize failed";
      }
    } else {
      normalizeStatus = "failed";
      normalizeError = "HWP→HWPX 변환 실패";
    }
  } else if (format === "hwpx") {
    normalizeStatus = "ok";
    if (isSupabaseConfigured()) {
      canonicalPath = await uploadDocumentBlob(localId, "canonical.hwpx", buffer, file.name);
    }
  }

  if (isSupabaseConfigured()) {
    await upsertDocumentMeta({
      local_id: localId,
      file_name: file.name,
      format,
      mime_type: file.type,
      original_storage_path: `${localId}/original.${file.name.split(".").pop() ?? "bin"}`,
      canonical_hwpx_path: canonicalPath,
      dvc_score: dvcScore,
      dvc_report: dvcReport,
      normalize_status: normalizeStatus,
      normalize_error: normalizeError,
      size_bytes: file.size,
    });
  }
}

export { detectHwpSecurityHint };
