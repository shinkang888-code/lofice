/** HWP/HWPX 암호화·배포용 문서 휴리스틱 감지 */

const OLE_MAGIC = [0xd0, 0xcf, 0x11, 0xe0];

export function isOleCompound(buffer: ArrayBuffer): boolean {
  const b = new Uint8Array(buffer.slice(0, 4));
  return OLE_MAGIC.every((v, i) => b[i] === v);
}

export function isZipHwpx(buffer: ArrayBuffer): boolean {
  const b = new Uint8Array(buffer.slice(0, 4));
  return b[0] === 0x50 && b[1] === 0x4b;
}

export type HwpSecurityHint = "none" | "encrypted" | "distribution" | "unknown";

/** 완벽하지 않음 — 파서 실패 시 UI 게이트용 */
export function detectHwpSecurityHint(buffer: ArrayBuffer, fileName: string): HwpSecurityHint {
  const lower = fileName.toLowerCase();
  if (lower.includes("배포") || lower.includes("drm")) return "distribution";

  if (!isOleCompound(buffer)) {
    if (isZipHwpx(buffer)) return "none";
    return "unknown";
  }

  const head = new TextDecoder("latin1", { fatal: false }).decode(buffer.slice(0, Math.min(8192, buffer.byteLength)));
  if (/encrypted|password|distribution|배포|암호/i.test(head)) {
    if (/distribution|배포/i.test(head)) return "distribution";
    return "encrypted";
  }
  return "none";
}

export function isLikelyEncryptedHwpError(message: string): boolean {
  return /암호|password|encrypt|protected|배포|drm/i.test(message);
}
