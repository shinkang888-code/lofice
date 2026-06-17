import type { Messages } from "./types";

/** Deep-merge locale overrides onto English fallback */
export function mergeMessages(base: Messages, patch: DeepPartial<Messages>): Messages {
  return deepMerge(base, patch) as Messages;
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

function deepMerge<T extends object>(base: T, patch: DeepPartial<T>): T {
  const out = { ...base } as T;
  for (const key of Object.keys(patch) as (keyof T)[]) {
    const pv = patch[key];
    const bv = base[key];
    if (pv && typeof pv === "object" && !Array.isArray(pv) && bv && typeof bv === "object") {
      out[key] = deepMerge(bv as object, pv as object) as T[typeof key];
    } else if (pv !== undefined) {
      out[key] = pv as T[typeof key];
    }
  }
  return out;
}

export function getByPath(obj: unknown, path: string): string | undefined {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === "string" ? cur : undefined;
}
