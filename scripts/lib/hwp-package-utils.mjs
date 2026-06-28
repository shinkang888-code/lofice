/**
 * Node test helpers � mirrors src/lib/hwp/extract-hwp-package.ts (no TS compile in scripts).
 */
import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";

export const HWPML_DOCSUMMARY_PATHS = {
  title: "/HWPML/HEAD/DOCSUMMARY/TITLE",
  author: "/HWPML/HEAD/DOCSUMMARY/AUTHOR",
  subject: "/HWPML/HEAD/DOCSUMMARY/SUBJECT",
  date: "/HWPML/HEAD/DOCSUMMARY/DATE",
  keywords: "/HWPML/HEAD/DOCSUMMARY/KEYWORDS",
};

export const HWPX_REQUIRED_ENTRIES = [
  "mimetype",
  "META-INF/container.xml",
  "Contents/content.hpf",
];

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  trimValues: true,
});

function firstString(value) {
  if (value == null) return undefined;
  if (typeof value === "string") {
    const t = value.trim();
    return t || undefined;
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    const obj = value;
    if ("#text" in obj) return firstString(obj["#text"]);
    if ("@_val" in obj) return firstString(obj["@_val"]);
    if ("val" in obj) return firstString(obj.val);
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const s = firstString(item);
      if (s) return s;
    }
  }
  return undefined;
}

function walkForMetadata(node, out, depth = 0) {
  if (node == null || depth > 20) return;
  if (Array.isArray(node)) {
    for (const item of node) walkForMetadata(item, out, depth + 1);
    return;
  }
  if (typeof node !== "object") return;
  const aliases = {
    title: ["title", "dc:title"],
    author: ["author", "dc:creator", "creator"],
    subject: ["subject", "dc:subject"],
    date: ["date", "dc:date"],
    keywords: ["keywords", "keyword"],
  };
  for (const [field, keys] of Object.entries(aliases)) {
    if (out[field]) continue;
    for (const [key, raw] of Object.entries(node)) {
      const keyLower = key.toLowerCase().replace(/^@_/, "");
      if (keys.some((k) => k.toLowerCase() === keyLower)) {
        const val = firstString(raw);
        if (val) out[field] = val;
      }
    }
  }
  for (const raw of Object.values(node)) walkForMetadata(raw, out, depth + 1);
}

export async function extractHwpxPackageSmoke(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const names = Object.keys(zip.files);
  const metadata = {};
  const missingRequired = HWPX_REQUIRED_ENTRIES.filter(
    (req) => !names.some((n) => n === req || n.endsWith(req.split("/").pop()))
  );

  let mimeType;
  const mimeEntry = names.find((n) => n === "mimetype" || n.endsWith("/mimetype"));
  if (mimeEntry) {
    mimeType = (await zip.file(mimeEntry).async("string")).trim();
  }

  for (const name of names.filter((n) => n.endsWith(".xml") || n.endsWith(".hpf"))) {
    try {
      const xml = await zip.file(name).async("string");
      walkForMetadata(xmlParser.parse(xml), metadata);
    } catch {
      /* skip */
    }
  }

  const hwpmlPathsMapped = Object.keys(HWPML_DOCSUMMARY_PATHS).filter((f) => metadata[f]);

  return {
    mimeType,
    missingRequired,
    metadata,
    hwpmlPathsMapped: hwpmlPathsMapped.map((f) => HWPML_DOCSUMMARY_PATHS[f]),
    entryCount: names.length,
  };
}

export function isOleCompound(buffer) {
  const b = new Uint8Array(buffer.slice(0, 4));
  return b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0;
}

export function isZipHwpx(buffer) {
  const b = new Uint8Array(buffer.slice(0, 4));
  return b[0] === 0x50 && b[1] === 0x4b;
}
