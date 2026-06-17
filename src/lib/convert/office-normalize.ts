/**
 * 레거시 Office → OOXML 정규화 클라이언트 (office-convert-api)
 */
import { getOfficeConvertUrl, isOfficeConvertAvailable } from "./config";
import type { OfficeCanonicalFormat } from "@/lib/document/office-canonical-model";

export type NormalizeResult = {
  file_name: string;
  data_base64: string;
  format: OfficeCanonicalFormat;
};

function requireBase(): string {
  const base = getOfficeConvertUrl();
  if (!base) throw new Error("office-convert API URL이 설정되지 않았습니다.");
  return base;
}

export function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export async function normalizeOfficeDocument(
  buffer: ArrayBuffer,
  fileName: string,
): Promise<NormalizeResult> {
  const form = new FormData();
  form.append("file", new Blob([buffer]), fileName);
  const res = await fetch(`${requireBase()}/normalize`, { method: "POST", body: form });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as NormalizeResult;
}

export async function convertLegacyOffice(
  buffer: ArrayBuffer,
  fileName: string,
  target: OfficeCanonicalFormat,
): Promise<NormalizeResult> {
  const form = new FormData();
  form.append("file", new Blob([buffer]), fileName);
  form.append("target", target);
  const res = await fetch(`${requireBase()}/convert/libreoffice`, { method: "POST", body: form });
  if (!res.ok) throw new Error(await res.text());
  const data = (await res.json()) as { file_name: string; data_base64: string; format: string };
  return {
    file_name: data.file_name,
    data_base64: data.data_base64,
    format: target,
  };
}

export { isOfficeConvertAvailable };
