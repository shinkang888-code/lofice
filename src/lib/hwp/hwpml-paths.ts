/**
 * HWPML DOCSUMMARY paths observed in Hancom HML2DAISY3.xsl (read-only study).
 * Used for metadata extraction and export mapping; not tied to Hancom binaries.
 */

export const HWPML_DOCSUMMARY_PATHS = {
  title: "/HWPML/HEAD/DOCSUMMARY/TITLE",
  author: "/HWPML/HEAD/DOCSUMMARY/AUTHOR",
  subject: "/HWPML/HEAD/DOCSUMMARY/SUBJECT",
  date: "/HWPML/HEAD/DOCSUMMARY/DATE",
  keywords: "/HWPML/HEAD/DOCSUMMARY/KEYWORDS",
} as const;

export type HwpmlDocSummaryField = keyof typeof HWPML_DOCSUMMARY_PATHS;

/** OWPML/HWPX header.xml and content.hpf tag names that map to DOCSUMMARY fields */
export const HWPX_METADATA_ALIASES: Record<HwpmlDocSummaryField, string[]> = {
  title: ["title", "dc:title", "Title", "document-title"],
  author: ["author", "dc:creator", "Creator", "creator"],
  subject: ["subject", "dc:subject", "Subject"],
  date: ["date", "dc:date", "Date", "modified", "created"],
  keywords: ["keywords", "keyword", "dc:subject", "Keywords"],
};

export const HWPX_EXPECTED_MIME = "application/hwp+zip";

/** hwpxjs and OWPML writers may emit this MIME instead of Hancom hwp+zip */
export const HWPX_ALT_MIMES = ["application/owpml", "application/hwp+xml"] as const;

export const HWPX_REQUIRED_ENTRIES = [
  "mimetype",
  "META-INF/container.xml",
  "Contents/content.hpf",
] as const;
