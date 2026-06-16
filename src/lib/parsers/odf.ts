import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function extractOdfParagraphs(doc: unknown): string[] {
  const paras: string[] = [];
  function walk(node: unknown) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const rec = node as Record<string, unknown>;
    const tag = Object.keys(rec).find((k) => k === "p" || k === "h" || k.endsWith(":p") || k.endsWith(":h"));
    if (tag) {
      const items = Array.isArray(rec[tag]) ? rec[tag] : [rec[tag]];
      for (const item of items) {
        if (typeof item === "string" && item.trim()) paras.push(item.trim());
        else if (item && typeof item === "object") {
          const t = (item as Record<string, unknown>)["#text"];
          if (typeof t === "string" && t.trim()) paras.push(t.trim());
          else collectText(item, paras);
        }
      }
    }
    for (const v of Object.values(rec)) walk(v);
  }
  function collectText(node: unknown, out: string[]) {
    if (typeof node === "string" && node.trim()) out.push(node.trim());
    else if (node && typeof node === "object") {
      for (const v of Object.values(node as object)) collectText(v, out);
    }
  }
  walk(doc);
  return paras;
}

/** ODT → HTML */
export async function parseOdtToHtml(buffer: ArrayBuffer): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);
  const content = await zip.file("content.xml")?.async("string");
  if (!content) throw new Error("ODT content.xml 없음");

  const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true, textNodeName: "#text" });
  const doc = parser.parse(content);
  const paras = extractOdfParagraphs(doc);

  if (paras.length === 0) return "<p>내용이 없습니다.</p>";
  return paras.map((p) => `<p class="mb-2">${escapeHtml(p)}</p>`).join("");
}

/** ODS → XlsxContent 호환 구조 */
export async function parseOdsToSheets(buffer: ArrayBuffer): Promise<{ name: string; rows: (string | number | null)[][] }[]> {
  const zip = await JSZip.loadAsync(buffer);
  const content = await zip.file("content.xml")?.async("string");
  if (!content) throw new Error("ODS content.xml 없음");

  const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true, textNodeName: "#text" });
  const doc = parser.parse(content);
  const rows: (string | number | null)[][] = [];
  const cells: string[] = [];

  function walk(node: unknown) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach(walk);
    const rec = node as Record<string, unknown>;
    if (rec["table-row"]) {
      const rowTag = rec["table-row"];
      const rowList = Array.isArray(rowTag) ? rowTag : rowTag ? [rowTag] : [];
      for (const row of rowList) {
        const rowCells: (string | number | null)[] = [];
        const cellTag = (row as Record<string, unknown>)["table-cell"] ?? (row as Record<string, unknown>).cell;
        const cellList = Array.isArray(cellTag) ? cellTag : cellTag ? [cellTag] : [];
        for (const cell of cellList) {
          const texts: string[] = [];
          collectText(cell, texts);
          rowCells.push(texts.join(" ") || null);
        }
        if (rowCells.length) rows.push(rowCells);
      }
    }
    for (const v of Object.values(rec)) walk(v);
  }

  function collectText(node: unknown, out: string[]) {
    if (typeof node === "string" && node.trim()) out.push(node.trim());
    else if (node && typeof node === "object") {
      for (const v of Object.values(node as object)) collectText(v, out);
    }
  }

  walk(doc);
  if (rows.length === 0) {
    const texts: string[] = [];
    collectText(doc, texts);
    return [{ name: "Sheet1", rows: texts.map((t) => [t]) }];
  }
  return [{ name: "Sheet1", rows }];
}
