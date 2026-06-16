/** Office Tool Plus 해시 체크 — Web Crypto API */

export type HashAlgorithm = "SHA-256" | "SHA-384" | "SHA-512" | "SHA-1";

export type FileHashResult = {
  fileName: string;
  size: number;
  hashes: Partial<Record<HashAlgorithm, string>>;
};

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function computeFileHashes(
  file: File,
  algorithms: HashAlgorithm[] = ["SHA-256"],
): Promise<FileHashResult> {
  const buffer = await file.arrayBuffer();
  const hashes: Partial<Record<HashAlgorithm, string>> = {};

  for (const algo of algorithms) {
    const digest = await crypto.subtle.digest(algo, buffer);
    hashes[algo] = toHex(digest);
  }

  return { fileName: file.name, size: file.size, hashes };
}

export async function computeBufferHash(buffer: ArrayBuffer, algo: HashAlgorithm = "SHA-256"): Promise<string> {
  const digest = await crypto.subtle.digest(algo, buffer);
  return toHex(digest);
}

export function exportHashesCsv(results: FileHashResult[]): string {
  const algos = Object.keys(results[0]?.hashes ?? {}) as HashAlgorithm[];
  const header = ["fileName", "size", ...algos].join(",");
  const rows = results.map((r) =>
    [r.fileName, String(r.size), ...algos.map((a) => r.hashes[a] ?? "")].join(","),
  );
  return [header, ...rows].join("\n");
}
