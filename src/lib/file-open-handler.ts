import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { dispatchLoficeEvent } from "@/lib/reactTypes/events";
import { tryOpenWithLofficeEngine } from "@/lib/loffice-engine/client";
import { saveFileLocal } from "@/lib/storage/local";

export async function openFileFromHandle(file: File, router: AppRouterInstance) {
  try {
    const engineResult = await tryOpenWithLofficeEngine(file);
    if (engineResult?.id && engineResult.editorUrl) {
      dispatchLoficeEvent("lofice:documentOpened", {
        fileName: file.name,
        mimeType: file.type || undefined,
        size: file.size,
        engine: "loffice-libreoffice",
      });
      const q = new URLSearchParams({ id: engineResult.id, name: engineResult.name || file.name });
      router.push(`/engine-editor/?${q.toString()}`);
      return;
    }
  } catch (err) {
    console.warn("Loffice engine open failed, falling back to local viewer:", err);
  }

  const id = await saveFileLocal(file);
  dispatchLoficeEvent("lofice:documentOpened", {
    fileName: file.name,
    mimeType: file.type || undefined,
    size: file.size,
  });
  router.push(`/viewer/?id=${id}`);
}

export async function openFileFromBase64(
  name: string,
  data: string,
  router: AppRouterInstance,
) {
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const file = new File([bytes], name);
  await openFileFromHandle(file, router);
}
