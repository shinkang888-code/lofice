import type { ProTargetFormat } from "./types";

export type ProHistoryEntry = {
  id: string;
  fileName: string;
  target: ProTargetFormat;
  resultName: string;
  savedId?: string;
  at: string;
};

const STORAGE_KEY = "lofice-pro-history";
const MAX_ENTRIES = 30;

export function loadProHistory(): ProHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ProHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendProHistory(entry: Omit<ProHistoryEntry, "id" | "at">): ProHistoryEntry[] {
  const next: ProHistoryEntry = {
    ...entry,
    id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: new Date().toISOString(),
  };
  const list = [next, ...loadProHistory()].slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}

export function clearProHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
