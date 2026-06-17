/**
 * lofice Pro API 클라이언트 — lofice-contracts/openapi.yaml 구현
 */
import { getOfficeConvertUrl } from "@/lib/convert/config";
import type { ProConvertResponse, ProEngineState, ProHealthResponse, ProTargetFormat } from "./types";

export function getProApiBase(): string | null {
  return getOfficeConvertUrl();
}

export function isProApiConfigured(): boolean {
  return Boolean(getProApiBase());
}

async function parseApiError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { detail?: string };
    if (typeof body.detail === "string") return body.detail;
  } catch {
    /* fall through */
  }
  const text = await res.text();
  return text || res.statusText || "Pro API 오류";
}

function requireBase(): string {
  const base = getProApiBase();
  if (!base) throw new Error("Pro API URL을 /pro/ 화면에서 입력하세요.");
  return base;
}

export function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export async function fetchProHealth(): Promise<ProHealthResponse | null> {
  const base = getProApiBase();
  if (!base) return null;
  try {
    const res = await fetch(`${base}/health`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as ProHealthResponse;
  } catch {
    return null;
  }
}

export function resolveEngineState(health: ProHealthResponse | null): ProEngineState {
  if (!health || health.status !== "ok") return "offline";
  if (!health.libreoffice) return "degraded";
  return "ready";
}

export async function normalizeOfficeDocument(
  buffer: ArrayBuffer,
  fileName: string,
): Promise<ProConvertResponse> {
  const form = new FormData();
  form.append("file", new Blob([buffer]), fileName);
  const res = await fetch(`${requireBase()}/normalize`, { method: "POST", body: form });
  if (!res.ok) throw new Error(await parseApiError(res));
  return (await res.json()) as ProConvertResponse;
}

export async function convertWithLibreOffice(
  buffer: ArrayBuffer,
  fileName: string,
  target: ProTargetFormat,
): Promise<ProConvertResponse> {
  const form = new FormData();
  form.append("file", new Blob([buffer]), fileName);
  form.append("target", target);
  const res = await fetch(`${requireBase()}/convert/libreoffice`, { method: "POST", body: form });
  if (!res.ok) throw new Error(await parseApiError(res));
  return (await res.json()) as ProConvertResponse;
}

export async function convertHwpxToDocx(buffer: ArrayBuffer, fileName: string): Promise<ProConvertResponse> {
  const form = new FormData();
  form.append("file", new Blob([buffer]), fileName);
  const res = await fetch(`${requireBase()}/convert/hwpx-to-docx`, { method: "POST", body: form });
  if (!res.ok) throw new Error(await parseApiError(res));
  return (await res.json()) as ProConvertResponse;
}

/** 레거시 Office는 normalize, 그 외는 libreoffice convert */
export async function convertWithProEngine(
  buffer: ArrayBuffer,
  fileName: string,
  target: ProTargetFormat,
): Promise<ProConvertResponse> {
  const ext = fileName.includes(".") ? fileName.slice(fileName.lastIndexOf(".")).toLowerCase() : "";
  const legacy = [".doc", ".dot", ".xls", ".xlt", ".ppt", ".pps", ".pot"];
  if (legacy.includes(ext) && (target === "docx" || target === "xlsx" || target === "pptx")) {
    return normalizeOfficeDocument(buffer, fileName);
  }
  if (ext === ".hwpx" && target === "docx") {
    return convertHwpxToDocx(buffer, fileName);
  }
  return convertWithLibreOffice(buffer, fileName, target);
}

export { isProApiConfigured as isOfficeConvertAvailable };
