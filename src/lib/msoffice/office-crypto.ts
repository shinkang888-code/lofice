/**
 * herumi/msoffice (MS-OFFCRYPTO) — lofice 브라우저 이식
 * @see https://github.com/shinkang888-code/msoffice
 * 클라이언트: officecrypto-tool (ECMA-376 Agile/Standard + 레거시 RC4)
 */

export type OfficeCryptoExt =
  | "docx"
  | "xlsx"
  | "pptx"
  | "docm"
  | "xlsm"
  | "pptm"
  | "doc"
  | "xls"
  | "ppt";

/** msoffice-crypt.exe -e 지원 (Office 2010+ OOXML) */
export const MSOFFICE_ENCRYPT_EXTS: readonly OfficeCryptoExt[] = ["docx", "xlsx", "pptx"];

/** 복호화 지원 확장자 */
export const MSOFFICE_DECRYPT_EXTS: readonly OfficeCryptoExt[] = [
  "docx",
  "xlsx",
  "pptx",
  "docm",
  "xlsm",
  "pptm",
  "doc",
  "xls",
  "ppt",
];

export type OfficeCryptoMode = "encrypt" | "decrypt";

export type OfficeCryptoOptions = {
  password: string;
  /** encrypt only — standard(AES128) | agile(AES256, default) */
  encMode?: "standard" | "agile";
};

export type OfficeCryptoResult = {
  bytes: Uint8Array;
  fileName: string;
};

export class OfficeCryptoError extends Error {
  constructor(
    message: string,
    public readonly code: "unsupported" | "bad_password" | "already_encrypted" | "not_encrypted" | "unknown",
  ) {
    super(message);
    this.name = "OfficeCryptoError";
  }
}

function extOf(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

export function isOfficeCryptoFileName(fileName: string): boolean {
  return MSOFFICE_DECRYPT_EXTS.includes(extOf(fileName) as OfficeCryptoExt);
}

export function canEncryptOfficeFileName(fileName: string): boolean {
  return MSOFFICE_ENCRYPT_EXTS.includes(extOf(fileName) as OfficeCryptoExt);
}

function mapCryptoError(e: unknown, mode: OfficeCryptoMode): never {
  const msg = e instanceof Error ? e.message : String(e);
  if (/password is incorrect/i.test(msg)) {
    throw new OfficeCryptoError("비밀번호가 올바르지 않습니다.", "bad_password");
  }
  if (/Unsupported encryption/i.test(msg)) {
    throw new OfficeCryptoError("지원하지 않는 암호화 형식입니다.", "unsupported");
  }
  if (/maximum password length/i.test(msg)) {
    throw new OfficeCryptoError("비밀번호는 최대 255자까지입니다.", "unknown");
  }
  throw new OfficeCryptoError(
    mode === "decrypt" ? `복호화 실패: ${msg}` : `암호화 실패: ${msg}`,
    "unknown",
  );
}

async function loadOfficeCrypto() {
  const mod = await import("officecrypto-tool");
  return mod.default ?? mod;
}

/** officecrypto-tool 타입은 Buffer이지만 런타임은 ArrayBuffer 지원 */
function asCryptoInput(buffer: ArrayBuffer): Buffer {
  return buffer as unknown as Buffer;
}

export async function isOfficeEncrypted(buffer: ArrayBuffer): Promise<boolean> {
  const crypto = await loadOfficeCrypto();
  return crypto.isEncrypted(asCryptoInput(buffer));
}

export async function decryptOfficeDocument(
  buffer: ArrayBuffer,
  fileName: string,
  options: OfficeCryptoOptions,
): Promise<OfficeCryptoResult> {
  if (!options.password) throw new OfficeCryptoError("비밀번호를 입력하세요.", "bad_password");
  const crypto = await loadOfficeCrypto();
  try {
    const encrypted = await crypto.isEncrypted(asCryptoInput(buffer));
    if (!encrypted) {
      throw new OfficeCryptoError("암호화되지 않은 파일입니다.", "not_encrypted");
    }
    const out = await crypto.decrypt(asCryptoInput(buffer), { password: options.password });
    const base = fileName.replace(/\.[^.]+$/, "");
    const ext = extOf(fileName);
    return {
      bytes: new Uint8Array(out),
      fileName: `${base}-decrypted.${ext}`,
    };
  } catch (e) {
    if (e instanceof OfficeCryptoError) throw e;
    return mapCryptoError(e, "decrypt");
  }
}

export async function encryptOfficeDocument(
  buffer: ArrayBuffer,
  fileName: string,
  options: OfficeCryptoOptions,
): Promise<OfficeCryptoResult> {
  if (!canEncryptOfficeFileName(fileName)) {
    throw new OfficeCryptoError("암호화는 docx, xlsx, pptx만 지원합니다.", "unsupported");
  }
  if (!options.password) throw new OfficeCryptoError("비밀번호를 입력하세요.", "bad_password");
  const crypto = await loadOfficeCrypto();
  try {
    const encrypted = await crypto.isEncrypted(asCryptoInput(buffer));
    if (encrypted) {
      throw new OfficeCryptoError("이미 암호화된 파일입니다.", "already_encrypted");
    }
    const encOpts =
      options.encMode === "standard"
        ? { password: options.password, type: "standard" as const }
        : { password: options.password };
    const out = crypto.encrypt(asCryptoInput(buffer), encOpts);
    const base = fileName.replace(/\.[^.]+$/, "");
    const ext = extOf(fileName);
    return {
      bytes: new Uint8Array(out),
      fileName: `${base}-encrypted.${ext}`,
    };
  } catch (e) {
    if (e instanceof OfficeCryptoError) throw e;
    return mapCryptoError(e, "encrypt");
  }
}

export function downloadOfficeBytes(bytes: Uint8Array, fileName: string): void {
  const blob = new Blob([new Uint8Array(bytes)], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
