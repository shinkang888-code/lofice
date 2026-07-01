import {
  getLofficeEngineUrl,
  isLofficeEngineEditable,
} from "./config";

export type EngineHealth = {
  ok: boolean;
  libreOffice: string | null;
  collabora: boolean;
};

export type EngineConvertResult = {
  id: string;
  name: string;
  ext: string;
  editable?: boolean;
  collabora?: boolean;
  editorUrl?: string | null;
};

const TIMEOUT_MS = 120_000;

async function engineFetch(path: string, init?: RequestInit): Promise<Response> {
  const base = getLofficeEngineUrl();
  return fetch(`${base}${path}`, {
    ...init,
    signal: init?.signal ?? AbortSignal.timeout(TIMEOUT_MS),
  });
}

export async function checkLofficeEngineHealth(): Promise<EngineHealth> {
  try {
    const res = await engineFetch("/health");
    if (!res.ok) return { ok: false, libreOffice: null, collabora: false };
    const data = await res.json();
    return {
      ok: data.status === "ok",
      libreOffice: data.libreOffice ?? data.libreoffice ?? null,
      collabora: !!data.collabora,
    };
  } catch {
    return { ok: false, libreOffice: null, collabora: false };
  }
}

export async function wakeLofficeEngine(): Promise<boolean> {
  try {
    const health = await checkLofficeEngineHealth();
    if (!health.ok) return false;
    await engineFetch("/api/warmup").catch(() => null);
    return true;
  } catch {
    return false;
  }
}

export async function convertViaLofficeEngine(file: File): Promise<EngineConvertResult> {
  await wakeLofficeEngine();
  const form = new FormData();
  form.append("file", file);
  form.append("filename", file.name);
  const res = await engineFetch("/api/convert", { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "엔진 변환 실패" }));
    throw new Error(typeof err.error === "string" ? err.error : "엔진 변환 실패");
  }
  return (await res.json()) as EngineConvertResult;
}

export async function getLofficeEditorUrl(docId: string): Promise<string | null> {
  const res = await engineFetch(`/api/documents/${docId}/editor-url`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.editorUrl ?? null;
}

export function shouldUseLofficeEngine(fileName: string): boolean {
  return isLofficeEngineEditable(fileName);
}

export async function tryOpenWithLofficeEngine(file: File): Promise<EngineConvertResult | null> {
  if (!shouldUseLofficeEngine(file.name)) return null;
  const health = await checkLofficeEngineHealth();
  if (!health.ok || !health.collabora) return null;
  return convertViaLofficeEngine(file);
}
