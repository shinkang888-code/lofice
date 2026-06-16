/**
 * 선택적 msoffice-crypt.exe API (Electron / Windows)
 * NEXT_PUBLIC_MSOFFICE_CRYPTO_URL=http://localhost:8200
 */

const BASE = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_MSOFFICE_CRYPTO_URL : undefined;

export function isMsofficeApiConfigured(): boolean {
  return Boolean(BASE?.trim());
}

export async function msofficeApiDecrypt(
  buffer: ArrayBuffer,
  fileName: string,
  password: string,
): Promise<ArrayBuffer> {
  if (!BASE) throw new Error("MSOFFICE API 미설정");
  const form = new FormData();
  form.append("file", new Blob([buffer]), fileName);
  form.append("password", password);
  const res = await fetch(`${BASE.replace(/\/$/, "")}/decrypt`, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? `API 오류 ${res.status}`);
  }
  return res.arrayBuffer();
}

export async function msofficeApiEncrypt(
  buffer: ArrayBuffer,
  fileName: string,
  password: string,
  encMode: "standard" | "agile" = "agile",
): Promise<ArrayBuffer> {
  if (!BASE) throw new Error("MSOFFICE API 미설정");
  const form = new FormData();
  form.append("file", new Blob([buffer]), fileName);
  form.append("password", password);
  form.append("enc_mode", encMode === "standard" ? "0" : "1");
  const res = await fetch(`${BASE.replace(/\/$/, "")}/encrypt`, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? `API 오류 ${res.status}`);
  }
  return res.arrayBuffer();
}
