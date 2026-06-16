import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";
import type { HwpxContent, HwpxParagraph } from "@/types/document";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  isArray: (name) => ["hp:p", "hp:run", "hp:t", "hs:sec"].includes(name),
});

function extractText(node: unknown): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object") {
    const obj = node as Record<string, unknown>;
    if ("#text" in obj) return String(obj["#text"]);
    if ("hp:t" in obj) return extractText(obj["hp:t"]);
    if ("hp:run" in obj) return extractText(obj["hp:run"]);
    return Object.values(obj).map(extractText).join("");
  }
  return "";
}

function parseParagraph(p: unknown): HwpxParagraph {
  const para = p as Record<string, unknown>;
  const text = extractText(para["hp:run"] ?? para);
  const align = (para["hp:pPr"] as Record<string, unknown>)?.["hp:align"] as Record<string, string> | undefined;
  return { text: text.trim(), align: align?.["@_horizontal"] };
}

export async function parseHwpx(buffer: ArrayBuffer): Promise<HwpxContent> {
  const zip = await JSZip.loadAsync(buffer);
  const sections: HwpxContent["sections"] = [];
  let title = "문서";

  const sectionFiles = Object.keys(zip.files)
    .filter((f) => f.match(/Contents\/section\d+\.xml$/))
    .sort();

  for (const path of sectionFiles) {
    const xml = await zip.files[path].async("text");
    const parsed = parser.parse(xml);
    const body = parsed?.["hs:sec"] ?? parsed?.["hp:sec"] ?? parsed;
    const paragraphs: HwpxParagraph[] = [];

    const rawParas = body?.["hp:p"] ?? body?.["hp:body"]?.["hp:p"];
    if (rawParas) {
      const arr = Array.isArray(rawParas) ? rawParas : [rawParas];
      for (const p of arr) paragraphs.push(parseParagraph(p));
    }

    if (paragraphs.length > 0) sections.push({ paragraphs });
  }

  const headerFile = Object.keys(zip.files).find((f) => f.includes("header.xml"));
  if (headerFile) {
    const xml = await zip.files[headerFile].async("text");
    const parsed = parser.parse(xml);
    const t = extractText(parsed);
    if (t) title = t.slice(0, 100);
  }

  if (sections.length === 0) {
    sections.push({ paragraphs: [{ text: "내용을 불러올 수 없습니다. HWPX 형식을 확인해 주세요." }] });
  }

  return { title, sections };
}

export async function parseHwpxFromFile(file: File): Promise<HwpxContent> {
  return parseHwpx(await file.arrayBuffer());
}
