/**
 * Feature parity checklist derived from Hancom UxXml / install-folder inventory (read-only).
 * Tracks lofice implementation status; not a copy of proprietary UI.
 */

export type ParityStatus = "done" | "partial" | "planned" | "n/a";

export interface ParityItem {
  id: string;
  feature: string;
  hancomRef: string;
  loficePath: string;
  status: ParityStatus;
  notes?: string;
}

export const HANCOM_HWP_PARITY_CHECKLIST: ParityItem[] = [
  {
    id: "view-hwpx-zip",
    feature: "HWPX ZIP container (application/hwp+zip)",
    hancomRef: "HNCFilter.dll MIME hint",
    loficePath: "src/lib/hwp/extract-hwp-package.ts",
    status: "done",
  },
  {
    id: "view-hwp-ole",
    feature: "Legacy HWP OLE compound detection",
    hancomRef: "StgOpenStorage / OLE magic",
    loficePath: "src/lib/document/hwp-detect.ts",
    status: "done",
  },
  {
    id: "meta-docsummary",
    feature: "DOCSUMMARY metadata (title, author, etc.)",
    hancomRef: "HML2DAISY3.xsl HWPML paths",
    loficePath: "src/lib/hwp/hwpml-paths.ts",
    status: "partial",
    notes: "HWPX header/content.hpf; full HWPML export in v2.26",
  },
  {
    id: "view-rhwp",
    feature: "WASM canvas viewer (primary)",
    hancomRef: "Native Hwp engine",
    loficePath: "src/components/hwp/RhwpCanvasViewer.tsx",
    status: "partial",
  },
  {
    id: "view-html-fallback",
    feature: "HTML fallback viewer",
    hancomRef: "hwpxjs extractHtml",
    loficePath: "src/components/viewer/HangulViewer.tsx",
    status: "done",
  },
  {
    id: "edit-hwpx",
    feature: "HWPX plain-text / HTML round-trip",
    hancomRef: "Hwp editor",
    loficePath: "src/lib/parsers/hancom.ts",
    status: "partial",
  },
  {
    id: "print-dialog",
    feature: "Print dialog with watermark tab",
    hancomRef: "UxXml common_print_dlg_hwp.xml",
    loficePath: "planned",
    status: "planned",
  },
  {
    id: "trial-banner",
    feature: "Trial / license UI in print flow",
    hancomRef: "showTrialProductAD attribute",
    loficePath: "n/a (lofice is free OSS)",
    status: "n/a",
  },
  {
    id: "dvc-validate",
    feature: "HWPX package validation (DVC-lite)",
    hancomRef: "Package structure",
    loficePath: "scripts/dvc-validate.mjs",
    status: "done",
  },
  {
    id: "encrypt-detect",
    feature: "Encrypted / distribution HWP hint",
    hancomRef: "DRM strings in OLE header",
    loficePath: "src/lib/document/hwp-detect.ts",
    status: "partial",
  },
];

export function paritySummary(): Record<ParityStatus, number> {
  const counts: Record<ParityStatus, number> = {
    done: 0,
    partial: 0,
    planned: 0,
    "n/a": 0,
  };
  for (const item of HANCOM_HWP_PARITY_CHECKLIST) {
    counts[item.status] += 1;
  }
  return counts;
}
