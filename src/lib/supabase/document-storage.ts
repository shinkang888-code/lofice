/**
 * Supabase Storage + documents 테이블 — 로컬 IndexedDB와 이중 저장
 */
import { getSupabase, isSupabaseConfigured } from "./client";

export type DocumentRow = {
  id: string;
  local_id: string;
  file_name: string;
  format: string;
  mime_type: string;
  original_storage_path: string | null;
  canonical_hwpx_path: string | null;
  canonical_docx_path: string | null;
  canonical_xlsx_path: string | null;
  canonical_pptx_path: string | null;
  dvc_score: number | null;
  dvc_report: Record<string, unknown> | null;
  normalize_status: "pending" | "ok" | "failed" | "skipped";
  normalize_error: string | null;
  size_bytes: number;
  created_at: string;
  updated_at: string;
};

export type StorageSuffix =
  | "original"
  | "canonical.hwpx"
  | "canonical.docx"
  | "canonical.xlsx"
  | "canonical.pptx";

const BUCKET = "documents";

export async function uploadDocumentBlob(
  localId: string,
  suffix: StorageSuffix,
  buffer: ArrayBuffer,
  fileName: string,
): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return null;

  let path: string;
  if (suffix === "original") {
    const ext = fileName.split(".").pop() ?? "bin";
    path = `${localId}/original.${ext}`;
  } else {
    path = `${localId}/${suffix}`;
  }

  const { error } = await sb.storage.from(BUCKET).upload(path, buffer, { upsert: true });
  if (error) {
    console.warn("[supabase] upload failed", error.message);
    return null;
  }
  return path;
}

export async function upsertDocumentMeta(
  meta: Partial<DocumentRow> & { local_id: string; file_name: string; format: string },
): Promise<DocumentRow | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const { data, error } = await sb
    .from("documents")
    .upsert({ ...meta, updated_at: new Date().toISOString() }, { onConflict: "local_id" })
    .select()
    .single();

  if (error) {
    console.warn("[supabase] upsert failed", error.message);
    return null;
  }
  return data as DocumentRow;
}

export async function getDocumentMeta(localId: string): Promise<DocumentRow | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.from("documents").select("*").eq("local_id", localId).maybeSingle();
  if (error) return null;
  return data as DocumentRow | null;
}

export { isSupabaseConfigured };
