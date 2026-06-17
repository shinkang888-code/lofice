"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Info } from "lucide-react";
import type { HwpPackageInfo } from "@/lib/hwp/extract-hwp-package";
import { HANCOM_HWP_PARITY_CHECKLIST } from "@/lib/hwp/hancom-parity-checklist";

const L = {
  docInfo: "\uBB38\uC11C \uC815\uBCF4",
  format: "\uD615\uC2DD",
  security: "\uBCF4\uC548",
  title: "\uC81C\uBAA9",
  author: "\uC791\uC131\uC790",
  subject: "\uC8FC\uC81C",
  date: "\uB0A0\uC9DC",
  keywords: "\uD0A4\uC6D0\uB4DC",
  noMeta: "\uBA54\uD0C0\uB370\uC774\uD130 \uC5C6\uC74C (\uBCF8\uBB38\uB9CC \uD45C\uC2DC)",
  hideRoadmap: "\uAE30\uB2A5 \uB85C\uB4DC\uB9F5 \uC228\uAE30\uAE30",
  showRoadmap: "Hancom \uB300\uBE44 \uAE30\uB2A5 \uB85C\uB4DC\uB9F5",
};

interface Props {
  packageInfo?: HwpPackageInfo | null;
  formatLabel?: string;
  className?: string;
}

function MetaRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-xs">
      <span className="text-gray-500 shrink-0 w-16">{label}</span>
      <span className="text-gray-800 truncate" title={value}>
        {value}
      </span>
    </div>
  );
}

export default function HwpDocumentInfoPanel({
  packageInfo,
  formatLabel,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [showParity, setShowParity] = useState(false);

  if (!packageInfo) return null;

  const { metadata, format, container, mimeType, securityHint, hwpmlPathsMapped } =
    packageInfo;
  const hasMeta =
    metadata.title ||
    metadata.author ||
    metadata.creator ||
    metadata.subject ||
    metadata.date ||
    metadata.keywords;

  return (
    <div className={`border-t border-gray-300 bg-[#fafafa] ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs text-gray-600 hover:bg-gray-100"
      >
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          {L.docInfo}
          {formatLabel ? ` - ${formatLabel}` : ""}
        </span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <div className="px-4 pb-3 space-y-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
            <span>
              {L.format}: {format.toUpperCase()} ({container})
            </span>
            {mimeType && <span className="truncate">MIME: {mimeType}</span>}
            {securityHint !== "none" && (
              <span className="text-amber-700 col-span-2">
                {L.security}: {securityHint}
              </span>
            )}
          </div>

          {hasMeta ? (
            <div className="space-y-1 pt-1 border-t border-gray-200">
              <MetaRow label={L.title} value={metadata.title} />
              <MetaRow label={L.author} value={metadata.author ?? metadata.creator} />
              <MetaRow label={L.subject} value={metadata.subject} />
              <MetaRow label={L.date} value={metadata.date} />
              <MetaRow label={L.keywords} value={metadata.keywords} />
            </div>
          ) : (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {L.noMeta}
            </p>
          )}

          {hwpmlPathsMapped.length > 0 && (
            <p className="text-[10px] text-gray-400 truncate" title={hwpmlPathsMapped.join(", ")}>
              HWPML: {hwpmlPathsMapped.length} path(s) mapped
            </p>
          )}

          <button
            type="button"
            onClick={() => setShowParity((v) => !v)}
            className="text-[10px] text-blue-600 hover:underline"
          >
            {showParity ? L.hideRoadmap : L.showRoadmap}
          </button>

          {showParity && (
            <ul className="text-[10px] text-gray-500 space-y-0.5 max-h-24 overflow-y-auto">
              {HANCOM_HWP_PARITY_CHECKLIST.filter((i) => i.status !== "n/a").map((item) => (
                <li key={item.id}>
                  [{item.status}] {item.feature}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
