import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { saveFileLocal } from "@/lib/storage/local";

export async function openFileFromBase64(
  name: string,
  data: string,
  router: AppRouterInstance
) {
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const file = new File([bytes], name);
  const id = await saveFileLocal(file);
  router.push(`/viewer/?id=${id}`);
}
