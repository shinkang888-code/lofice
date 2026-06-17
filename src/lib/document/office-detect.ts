/** MS Office 암호화·레거시 형식 감지 */

import {
  isOfficeCryptoFileName,
  isOfficeEncrypted,
} from "@/lib/msoffice/office-crypto";
import { isLegacyOfficeFormat } from "@/lib/document/office-canonical-model";

export type OfficeSecurityHint = "none" | "encrypted" | "legacy";

export async function detectOfficeSecurityHint(
  buffer: ArrayBuffer,
  fileName: string,
): Promise<OfficeSecurityHint> {
  if (isLegacyOfficeFormat(fileName)) return "legacy";
  if (!isOfficeCryptoFileName(fileName)) return "none";
  try {
    if (await isOfficeEncrypted(buffer)) return "encrypted";
  } catch {
    /* optional */
  }
  return "none";
}

export function isOfficeFormatName(fileName: string): boolean {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return [
    "doc", "docx", "docm", "dot", "dotx", "dotm",
    "xls", "xlsx", "xlsm", "xlsb", "xlt", "xltx", "xltm", "csv",
    "ppt", "pptx", "pptm", "pps", "ppsx", "ppsm", "pot", "potx", "potm",
    "odt", "ods", "odp",
  ].includes(ext);
}
