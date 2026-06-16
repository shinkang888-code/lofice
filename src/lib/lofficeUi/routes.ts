import { getDocumentType, isSupportedFile } from "@/lib/document-types";
import { saveFileLocal } from "@/lib/storage/local";

/** 저장된 파일 id로 적절한 편집·뷰어 라우트 반환 */
export function getEditorRouteForSavedFile(fileName: string, id: string): string {
  const type = getDocumentType(fileName);
  if (type === "archive") return `/archive/?id=${id}`;
  if (type === "hwp" || type === "hwpx") return `/hwp-editor/?id=${id}`;
  if (type === "presentation") return `/ppt-editor/?id=${id}`;
  return `/viewer/?id=${id}`;
}

/** 로컬 저장 후 해당 편집기로 이동 */
export async function openLocalDocument(
  file: File,
  navigate: (path: string) => void,
): Promise<boolean> {
  if (!isSupportedFile(file)) {
    alert("지원하지 않는 형식입니다.");
    return false;
  }
  const id = await saveFileLocal(file);
  navigate(getEditorRouteForSavedFile(file.name, id));
  return true;
}
