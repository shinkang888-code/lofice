import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";
import {
  HWPML_DOCSUMMARY_PATHS,
  HWPX_ALT_MIMES,
  HWPX_EXPECTED_MIME,
  HWPX_METADATA_ALIASES,
  HWPX_REQUIRED_ENTRIES,
  type HwpmlDocSummaryField,
} from "@/lib/hwp/hwpml-paths";
import {
  detectHwpSecurityHint,
  isOleCompound,
  isZipHwpx,
  type HwpSecurityHint,
} from "@/lib/document/hwp-detect";

export interface HwpPackageMetadata {
  title?: string;
  author?: string;
  subject?: string;
  date?: string;
  keywords?: string;
  creator?: string;
}

export interface HwpPackageInfo {
  format: "hwp" | "hwpx" | "unknown";
  container: "ole" | "zip" | "unknown";
  mimeType?: string;
  securityHint: HwpSecurityHint;
  packageEntries?: string[];
  missingRequired?: string[];
  metadata: HwpPackageMetadata;
  hwpmlPathsMapped: string[];
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  trimValues: true,
});

function firstString(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (typeof value === "string") {
    const t = value.trim();
    return t || undefined;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const s = firstString(item);
      if (s) return s;
    }
    return undefined;
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if ("#text" in obj) return firstString(obj["#text"]);
    if ("@_val" in obj) return firstString(obj["@_val"]);
    if ("@_value" in obj) return firstString(obj["@_value"]);
    if ("val" in obj) return firstString(obj.val);
    if ("value" in obj) return firstString(obj.value);
  }
  return undefined;
}

function walkForMetadata(
  node: unknown,
  out: HwpPackageMetadata,
  depth = 0
): void {
  if (node == null || depth > 24) return;

  if (Array.isArray(node)) {
    for (const item of node) walkForMetadata(item, out, depth + 1);
    return;
  }

  if (typeof node !== "object") return;

  for (const [key, raw] of Object.entries(node as Record<string, unknown>)) {
    const keyLower = key.toLowerCase().replace(/^@_/, "");
    for (const field of Object.keys(HWPX_METADATA_ALIASES) as HwpmlDocSummaryField[]) {
      if (out[field]) continue;
      const aliases = HWPX_METADATA_ALIASES[field];
      if (aliases.some((a) => a.toLowerCase() === keyLower)) {
        const val = firstString(raw);
        if (val) out[field] = val;
      }
    }
    if (keyLower === "creator" && !out.creator) {
      const val = firstString(raw);
      if (val) out.creator = val;
    }
    walkForMetadata(raw, out, depth + 1);
  }
}

function mappedHwpmlPaths(meta: HwpPackageMetadata): string[] {
  const mapped: string[] = [];
  for (const [field, xpath] of Object.entries(HWPML_DOCSUMMARY_PATHS)) {
    const key = field as HwpmlDocSummaryField;
    if (meta[key] || (key === "author" && meta.creator)) {
      mapped.push(xpath);
    }
  }
  return mapped;
}

async function extractFromHwpxZip(buffer: ArrayBuffer): Promise<Partial<HwpPackageInfo>> {
  const zip = await JSZip.loadAsync(buffer);
  const names = Object.keys(zip.files);
  const metadata: HwpPackageMetadata = {};
  const missingRequired = HWPX_REQUIRED_ENTRIES.filter(
    (req) => !names.some((n) => n === req || n.endsWith(req.split("/").pop()!))
  );

  let mimeType: string | undefined;
  const mimeEntry = names.find((n) => n === "mimetype" || n.endsWith("/mimetype"));
  if (mimeEntry) {
    const raw = await zip.file(mimeEntry)!.async("string");
    mimeType = raw.trim();
  }

  const xmlTargets = names.filter(
    (n) =>
      n.endsWith(".xml") ||
      n.endsWith(".hpf") ||
      n.includes("header") ||
      n.includes("content.hpf")
  );

  for (const name of xmlTargets) {
    try {
      const xml = await zip.file(name)!.async("string");
      const parsed = xmlParser.parse(xml);
      walkForMetadata(parsed, metadata);
    } catch {
      /* skip malformed entries */
    }
  }

  return {
    format: "hwpx",
    container: "zip",
    mimeType,
    packageEntries: names.slice(0, 80),
    missingRequired: missingRequired.length ? missingRequired : undefined,
    metadata,
    hwpmlPathsMapped: mappedHwpmlPaths(metadata),
  };
}

export async function extractHwpPackageInfo(buffer: ArrayBuffer): Promise<HwpPackageInfo> {
  const securityHint = detectHwpSecurityHint(buffer, "");

  if (isZipHwpx(buffer)) {
    const partial = await extractFromHwpxZip(buffer);
    return {
      format: partial.format ?? "hwpx",
      container: "zip",
      mimeType: partial.mimeType,
      securityHint,
      packageEntries: partial.packageEntries,
      missingRequired: partial.missingRequired,
      metadata: partial.metadata ?? {},
      hwpmlPathsMapped: partial.hwpmlPathsMapped ?? [],
    };
  }

  if (isOleCompound(buffer)) {
    return {
      format: "hwp",
      container: "ole",
      securityHint,
      metadata: {},
      hwpmlPathsMapped: [],
    };
  }

  return {
    format: "unknown",
    container: "unknown",
    securityHint,
    metadata: {},
    hwpmlPathsMapped: [],
  };
}

export function isValidHwpxMime(mimeType?: string): boolean {
  if (!mimeType) return false;
  const normalized = mimeType.trim().toLowerCase();
  if (normalized === HWPX_EXPECTED_MIME || normalized.includes("hwp+zip")) return true;
  return HWPX_ALT_MIMES.some((m) => normalized === m || normalized.includes("owpml"));
}
