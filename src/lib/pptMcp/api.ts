import { getPptMcpUrl } from "@/lib/pptMcp/config";
import type { PptColorSchemeId } from "@/lib/pptMcp/color-schemes";
import type { TemplateSequenceItem } from "@/lib/pptMcp/templates";
import type { PresentationTextResult } from "@/lib/pptMcp/text-extract";

export type PptMcpHealth = {
  ok: boolean;
  python_pptx?: boolean;
  templates?: number;
};

async function baseFetch(path: string, init?: RequestInit): Promise<Response> {
  const base = getPptMcpUrl();
  if (!base) throw new Error("PPT MCP API가 설정되지 않았습니다. NEXT_PUBLIC_PPT_MCP_URL");
  return fetch(`${base}${path}`, init);
}

export async function checkPptMcpHealth(): Promise<PptMcpHealth> {
  const res = await baseFetch("/health");
  if (!res.ok) throw new Error(`health check failed: ${res.status}`);
  return res.json() as Promise<PptMcpHealth>;
}

export async function pptMcpExtractText(file: File | ArrayBuffer, fileName: string): Promise<PresentationTextResult> {
  const form = new FormData();
  const blob = file instanceof ArrayBuffer ? new Blob([file]) : file;
  form.append("file", blob, fileName);
  const res = await baseFetch("/extract-text", { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? `extract failed ${res.status}`);
  }
  return res.json() as Promise<PresentationTextResult>;
}

export async function pptMcpCreateFromTemplates(
  sequence: TemplateSequenceItem[],
  colorScheme: PptColorSchemeId,
  fileName = "presentation.pptx",
): Promise<ArrayBuffer> {
  const res = await baseFetch("/create-from-templates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sequence, color_scheme: colorScheme, file_name: fileName }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? `create failed ${res.status}`);
  }
  return res.arrayBuffer();
}

export type AutoGenerateRequest = {
  topic: string;
  slide_count?: number;
  color_scheme?: PptColorSchemeId;
  language?: string;
};

export type PptGeneratorRequest = {
  user_text: string;
  number_of_slide?: number;
  template_choice?: string;
  presentation_title?: string;
  presenter_name?: string;
  insert_image?: boolean;
  language?: string;
};

export async function pptMcpGeneratorGenerate(req: PptGeneratorRequest): Promise<ArrayBuffer> {
  const res = await baseFetch("/generator/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? `generator failed ${res.status}`);
  }
  return res.arrayBuffer();
}

export async function pptMcpAutoGenerate(req: AutoGenerateRequest): Promise<ArrayBuffer> {
  const res = await baseFetch("/auto-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? `auto-generate failed ${res.status}`);
  }
  return res.arrayBuffer();
}

export function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}
