/**
 * CM 기반 HWPX ↔ DOCX 변환 클라이언트 (office-convert-api)
 */
import { getOfficeConvertUrl } from "./config";

export type ConvertResult = {
  file_name: string;
  data_base64: string;
  format: string;
};

function requireBase(): string {
  const base = getOfficeConvertUrl();
  if (!base) throw new Error("office-convert API URL이 설정되지 않았습니다. NEXT_PUBLIC_OFFICE_CONVERT_URL");
  return base;
}

export function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export async function convertHwpxToDocx(buffer: ArrayBuffer, fileName: string): Promise<ConvertResult> {
  const form = new FormData();
  form.append("file", new Blob([buffer]), fileName);
  const res = await fetch(`${requireBase()}/convert/hwpx-to-docx`, { method: "POST", body: form });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as ConvertResult;
}

export async function convertLegacyOffice(
  buffer: ArrayBuffer,
  fileName: string,
  target: "docx" | "pdf" = "docx",
): Promise<ConvertResult> {
  const form = new FormData();
  form.append("file", new Blob([buffer]), fileName);
  form.append("target", target);
  const res = await fetch(`${requireBase()}/convert/libreoffice`, { method: "POST", body: form });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as ConvertResult;
}

export async function checkOfficeConvertHealth(): Promise<boolean> {
  const base = getOfficeConvertUrl();
  if (!base) return false;
  try {
    const res = await fetch(`${base}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
