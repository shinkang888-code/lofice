import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";

export interface PptxSlide {
  index: number;
  title: string;
  html: string;
  /** 발표자 노트 (PPT Master speaker notes) */
  notes?: string;
  /** data URL 또는 blob URL */
  imageUrls?: string[];
  /** SVG 슬라이드 (PPT Master svg_output) */
  svg?: string;
  desc?: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function collectTexts(node: unknown, out: string[]): void {
  if (node == null) return;
  if (typeof node === "string") return;
  if (Array.isArray(node)) {
    node.forEach((n) => collectTexts(n, out));
    return;
  }
  if (typeof node === "object") {
    const rec = node as Record<string, unknown>;
    if (typeof rec.t === "string" && rec.t.trim()) out.push(rec.t.trim());
    for (const v of Object.values(rec)) collectTexts(v, out);
  }
}

async function tryOpenZip(buffer: ArrayBuffer): Promise<JSZip | null> {
  try {
    return await JSZip.loadAsync(buffer);
  } catch {
    return null;
  }
}

async function loadSlideRels(zip: JSZip, slideNum: number): Promise<Map<string, string>> {
  const relPath = `ppt/slides/_rels/slide${slideNum}.xml.rels`;
  const file = zip.file(relPath);
  const map = new Map<string, string>();
  if (!file) return map;
  const xml = await file.async("string");
  const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });
  const doc = parser.parse(xml);
  const rels = doc?.Relationships?.Relationship;
  const list = Array.isArray(rels) ? rels : rels ? [rels] : [];
  for (const rel of list) {
    const id = rel["@_Id"] ?? rel["@_id"];
    const target = rel["@_Target"] ?? rel["@_target"];
    if (id && target) map.set(id, target);
  }
  return map;
}

async function mediaToDataUrl(zip: JSZip, target: string): Promise<string | null> {
  const path = target.startsWith("../") ? `ppt/${target.slice(3)}` : target.startsWith("ppt/") ? target : `ppt/${target}`;
  const file = zip.file(path);
  if (!file) return null;
  const ext = path.split(".").pop()?.toLowerCase() ?? "png";
  const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "gif" ? "image/gif" : ext === "svg" ? "image/svg+xml" : "image/png";
  const b64 = await file.async("base64");
  return `data:${mime};base64,${b64}`;
}

function findEmbedIds(node: unknown, out: Set<string>): void {
  if (node == null || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach((n) => findEmbedIds(n, out));
    return;
  }
  const rec = node as Record<string, unknown>;
  for (const [k, v] of Object.entries(rec)) {
    if (k.endsWith("embed") || k.endsWith("Embed")) {
      if (typeof v === "string") out.add(v);
    }
    findEmbedIds(v, out);
  }
}

async function parseNotes(zip: JSZip, slideNum: number): Promise<string | undefined> {
  const notesPath = `ppt/notesSlides/notesSlide${slideNum}.xml`;
  const file = zip.file(notesPath);
  if (!file) return undefined;
  const xml = await file.async("string");
  const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });
  const texts: string[] = [];
  collectTexts(parser.parse(xml), texts);
  return texts.join("\n").trim() || undefined;
}

/** PPTX / PPTM / POTX 등 Open XML 프레젠테이션 */
export async function parsePptx(buffer: ArrayBuffer): Promise<{ slides: PptxSlide[] }> {
  const zip = await tryOpenZip(buffer);
  if (!zip) throw new Error("PowerPoint Open XML 형식이 아닙니다. (.pptx, .pptm 등)");

  const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });
  const slidePaths = Object.keys(zip.files)
    .filter((f) => /^ppt\/slides\/slide\d+\.xml$/i.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)![0], 10);
      const nb = parseInt(b.match(/\d+/)![0], 10);
      return na - nb;
    });

  const slides: PptxSlide[] = [];
  for (let i = 0; i < slidePaths.length; i++) {
    const slideNum = parseInt(slidePaths[i].match(/\d+/)![0], 10);
    const xml = await zip.file(slidePaths[i])!.async("string");
    const doc = parser.parse(xml);
    const texts: string[] = [];
    collectTexts(doc, texts);
    const title = texts[0] || `슬라이드 ${i + 1}`;
    const body = texts.slice(title === texts[0] ? 1 : 0);
    const html =
      body.length > 0
        ? body.map((t) => `<p class="mb-3 text-lg">${escapeHtml(t)}</p>`).join("")
        : `<p class="text-gray-400 italic">텍스트 없음</p>`;

    const rels = await loadSlideRels(zip, slideNum);
    const embedIds = new Set<string>();
    findEmbedIds(doc, embedIds);
    const imageUrls: string[] = [];
    for (const id of embedIds) {
      const target = rels.get(id);
      if (target) {
        const url = await mediaToDataUrl(zip, target);
        if (url) imageUrls.push(url);
      }
    }

    const notes = await parseNotes(zip, slideNum);

    slides.push({
      index: i + 1,
      title,
      html,
      notes,
      imageUrls: imageUrls.length ? imageUrls : undefined,
      desc: body[0]?.slice(0, 80),
    });
  }

  if (slides.length === 0) throw new Error("슬라이드를 찾을 수 없습니다.");
  return { slides };
}

/** ODP (OpenDocument Presentation) */
export async function parseOdp(buffer: ArrayBuffer): Promise<{ slides: PptxSlide[] }> {
  const zip = await tryOpenZip(buffer);
  if (!zip) throw new Error("ODP 형식이 아닙니다.");

  const content = await zip.file("content.xml")?.async("string");
  if (!content) throw new Error("content.xml을 찾을 수 없습니다.");

  const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });
  const doc = parser.parse(content);
  const texts: string[] = [];
  collectTexts(doc, texts);

  const chunk = Math.max(1, Math.ceil(texts.length / Math.max(1, Math.ceil(texts.length / 8))));
  const slides: PptxSlide[] = [];
  for (let i = 0; i < texts.length; i += chunk) {
    const slice = texts.slice(i, i + chunk);
    slides.push({
      index: slides.length + 1,
      title: slice[0] || `슬라이드 ${slides.length + 1}`,
      html: slice.map((t) => `<p class="mb-2">${escapeHtml(t)}</p>`).join(""),
    });
  }
  if (slides.length === 0) {
    slides.push({ index: 1, title: "슬라이드 1", html: "<p>내용 없음</p>" });
  }
  return { slides };
}

/** 레거시 .ppt 바이너리 — 텍스트 스트링 추출 시도 */
export function parseLegacyPpt(buffer: ArrayBuffer): { slides: PptxSlide[] } {
  const bytes = new Uint8Array(buffer);
  const raw = new TextDecoder("utf-16le", { fatal: false }).decode(bytes);
  const chunks = raw
    .split(/[\x00-\x08\x0b\x0c\x0e-\x1f]/)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s.length > 4 && /[\uAC00-\uD7A3a-zA-Z]/.test(s));

  const unique = [...new Set(chunks)].slice(0, 40);
  const perSlide = Math.max(3, Math.ceil(unique.length / 6));
  const slides: PptxSlide[] = [];

  for (let i = 0; i < unique.length; i += perSlide) {
    const slice = unique.slice(i, i + perSlide);
    slides.push({
      index: slides.length + 1,
      title: slice[0] || `슬라이드 ${slides.length + 1}`,
      html: slice.map((t) => `<p class="mb-2 text-sm">${escapeHtml(t.slice(0, 500))}</p>`).join(""),
    });
  }

  if (slides.length === 0) {
    throw new Error("레거시 PowerPoint(.ppt) 파일에서 텍스트를 추출하지 못했습니다. .pptx로 저장 후 다시 열어주세요.");
  }

  return { slides };
}

export async function parsePresentation(
  buffer: ArrayBuffer,
  fileName: string
): Promise<{ slides: PptxSlide[] }> {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "odp") return parseOdp(buffer);
  if (ext === "ppt" || ext === "pps") return parseLegacyPpt(buffer);
  return parsePptx(buffer);
}
