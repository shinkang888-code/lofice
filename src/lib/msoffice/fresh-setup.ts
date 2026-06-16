/**
 * lofice Fresh Setup — msoffice-removal-tool 정리 패턴
 */
import { clearAllFilesLocal } from "@/lib/storage/local";
import { resetPreferences } from "@/lib/officeTool/preferences";
import type { RemovalMethod } from "@/lib/msoffice/migration-stages";

export type FreshSetupResult = {
  clearedFiles: number;
  clearedCaches: string[];
  clearedStorageKeys: string[];
};

const LOFICE_STORAGE_PREFIXES = ["lofice-", "lofice_"];

async function clearCacheStorage(): Promise<string[]> {
  if (typeof caches === "undefined") return [];
  const names = await caches.keys();
  await Promise.all(names.map((n) => caches.delete(n)));
  return names;
}

async function unregisterServiceWorkers(): Promise<number> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return 0;
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.all(regs.map((r) => r.unregister()));
  return regs.length;
}

function clearLoficeLocalStorage(): string[] {
  const removed: string[] = [];
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (LOFICE_STORAGE_PREFIXES.some((p) => key.startsWith(p))) {
      localStorage.removeItem(key);
      removed.push(key);
    }
  }
  return removed;
}

export async function runLightCleanup(): Promise<FreshSetupResult> {
  const clearedFiles = await clearAllFilesLocal();
  resetPreferences();
  return { clearedFiles, clearedCaches: [], clearedStorageKeys: ["lofice-preferences"] };
}

export async function runDeepCleanup(): Promise<FreshSetupResult> {
  const clearedFiles = await clearAllFilesLocal();
  resetPreferences();
  const clearedCaches = await clearCacheStorage();
  await unregisterServiceWorkers();
  if (typeof sessionStorage !== "undefined") sessionStorage.clear();
  const clearedStorageKeys = clearLoficeLocalStorage();
  return { clearedFiles, clearedCaches, clearedStorageKeys };
}

export async function runFreshSetup(method: RemovalMethod): Promise<FreshSetupResult> {
  return method === "setup" ? runDeepCleanup() : runLightCleanup();
}
