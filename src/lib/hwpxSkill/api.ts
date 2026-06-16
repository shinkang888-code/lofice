/**
 * hwpx-skill FastAPI 클라이언트
 * @see https://github.com/jkf87/hwpx-skill
 */
import { getHwpxSkillUrl } from "./config";
import type {
  HwpxAiChatResult,
  HwpxExtractResult,
  HwpxSkillFileResult,
  HwpxSkillHealth,
  HwpxTemplateId,
} from "./types";

let healthCache: { data: HwpxSkillHealth | null; at: number } | null = null;
const HEALTH_TTL_MS = 30_000;

function requireBase(): string {
  const base = getHwpxSkillUrl();
  if (!base) {
    throw new Error("hwpx-skill 서버 URL이 설정되지 않았습니다. NEXT_PUBLIC_HWPX_SKILL_URL을 확인하세요.");
  }
  return base;
}

async function parseError(res: Response): Promise<string> {
  const text = await res.text().catch(() => "");
  try {
    const json = JSON.parse(text) as { detail?: unknown };
    if (typeof json.detail === "string") return json.detail;
  } catch {
    /* ignore */
  }
  return text || `hwpx-skill API 오류 (${res.status})`;
}

export function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export async function checkHwpxSkillHealth(force = false): Promise<HwpxSkillHealth | null> {
  const base = getHwpxSkillUrl();
  if (!base) return null;

  if (!force && healthCache && Date.now() - healthCache.at < HEALTH_TTL_MS) {
    return healthCache.data;
  }

  try {
    const res = await fetch(`${base}/health`);
    if (!res.ok) {
      healthCache = { data: null, at: Date.now() };
      return null;
    }
    const data = (await res.json()) as HwpxSkillHealth;
    healthCache = { data, at: Date.now() };
    return data;
  } catch {
    healthCache = { data: null, at: Date.now() };
    return null;
  }
}

export async function hwpxSkillExtract(
  buffer: ArrayBuffer,
  fileName: string,
  format: "plain" | "markdown" = "plain",
): Promise<HwpxExtractResult> {
  const form = new FormData();
  form.append("file", new Blob([buffer]), fileName);
  form.append("format", format);

  const res = await fetch(`${requireBase()}/extract`, { method: "POST", body: form });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as HwpxExtractResult;
}

export async function hwpxSkillConvertHwp(buffer: ArrayBuffer, fileName: string): Promise<HwpxSkillFileResult> {
  const form = new FormData();
  form.append("file", new Blob([buffer]), fileName);

  const res = await fetch(`${requireBase()}/convert`, { method: "POST", body: form });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as HwpxSkillFileResult;
}

export async function hwpxSkillCreateFromMarkdown(
  markdown: string,
  options: { template?: HwpxTemplateId; title?: string; creator?: string } = {},
): Promise<HwpxSkillFileResult> {
  const res = await fetch(`${requireBase()}/create/markdown`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      markdown,
      template: options.template ?? "report",
      title: options.title ?? "문서",
      creator: options.creator ?? "lofice",
    }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as HwpxSkillFileResult;
}

export async function hwpxSkillCloneForm(
  buffer: ArrayBuffer,
  fileName: string,
  replacements: Record<string, string>,
): Promise<HwpxSkillFileResult> {
  const res = await fetch(`${requireBase()}/clone-form`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      file_base64: arrayBufferToBase64(buffer),
      file_name: fileName,
      replacements,
    }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as HwpxSkillFileResult;
}

export async function hwpxSkillAnalyze(buffer: ArrayBuffer, fileName: string): Promise<{ analysis: string; texts: string[] }> {
  const form = new FormData();
  form.append("file", new Blob([buffer]), fileName);

  const res = await fetch(`${requireBase()}/analyze`, { method: "POST", body: form });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as { analysis: string; texts: string[] };
}

export async function hwpxSkillAiChat(params: {
  message: string;
  template?: HwpxTemplateId;
  documentText?: string;
  fileBuffer?: ArrayBuffer;
  fileName?: string;
}): Promise<HwpxAiChatResult> {
  const body: Record<string, unknown> = {
    message: params.message,
    template: params.template ?? "report",
    document_text: params.documentText,
  };

  if (params.fileBuffer) {
    body.file_base64 = arrayBufferToBase64(params.fileBuffer);
    body.file_name = params.fileName ?? "document.hwpx";
  }

  const res = await fetch(`${requireBase()}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as HwpxAiChatResult;
}
