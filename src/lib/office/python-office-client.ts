/**
 * python-office-api 배치 클라이언트
 */
const DEFAULT =
  process.env.NEXT_PUBLIC_PYTHON_OFFICE_DEFAULT_URL?.trim() ||
  "https://lofice-python-office.vercel.app";

export function getPythonOfficeUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_PYTHON_OFFICE_URL?.trim() || DEFAULT;
  return url ? url.replace(/\/+$/, "") : null;
}

export function isPythonOfficeAvailable(): boolean {
  return Boolean(getPythonOfficeUrl());
}

export type BatchConvertResult = {
  file_name: string;
  data_base64: string;
  format: string;
};

function b64ToArrayBuffer(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export async function convertPptToPdf(buffer: ArrayBuffer, fileName: string): Promise<ArrayBuffer> {
  const base = getPythonOfficeUrl();
  if (!base) throw new Error("python-office API 미설정");
  const form = new FormData();
  form.append("file", new Blob([buffer]), fileName);
  const res = await fetch(`${base}/convert/ppt-to-pdf`, { method: "POST", body: form });
  if (!res.ok) throw new Error(await res.text());
  const json = (await res.json()) as BatchConvertResult;
  return b64ToArrayBuffer(json.data_base64);
}

export async function splitExcelSheets(buffer: ArrayBuffer, fileName: string): Promise<BatchConvertResult> {
  const base = getPythonOfficeUrl();
  if (!base) throw new Error("python-office API 미설정");
  const form = new FormData();
  form.append("file", new Blob([buffer]), fileName);
  const res = await fetch(`${base}/convert/excel-split`, { method: "POST", body: form });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as BatchConvertResult;
}
