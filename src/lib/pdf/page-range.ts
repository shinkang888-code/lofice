/** Stirling-PDF split-pages 형식: "1-3,5,7" 또는 "all" */
export function parsePageRange(input: string, totalPages: number): number[] {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed || trimmed === "all") {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>();
  for (const part of trimmed.split(",")) {
    const segment = part.trim();
    if (!segment) continue;

    if (segment.includes("-")) {
      const [startStr, endStr] = segment.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (Number.isNaN(start) || Number.isNaN(end)) continue;
      const lo = Math.min(start, end);
      const hi = Math.max(start, end);
      for (let p = lo; p <= hi; p++) {
        if (p >= 1 && p <= totalPages) pages.add(p);
      }
    } else {
      const p = parseInt(segment, 10);
      if (!Number.isNaN(p) && p >= 1 && p <= totalPages) pages.add(p);
    }
  }

  return [...pages].sort((a, b) => a - b);
}

export function formatPageRange(pages: number[]): string {
  if (pages.length === 0) return "";
  const sorted = [...pages].sort((a, b) => a - b);
  const parts: string[] = [];
  let start = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i <= sorted.length; i++) {
    const cur = sorted[i];
    if (cur === prev + 1) {
      prev = cur;
      continue;
    }
    parts.push(start === prev ? `${start}` : `${start}-${prev}`);
    start = cur;
    prev = cur;
  }
  return parts.join(",");
}
