"use client";

import type { ProTargetFormat } from "@/lib/pro/types";
import { PRO_TARGET_LABELS } from "@/lib/pro/formats";
import { FileText, Presentation, Sheet, FileType } from "lucide-react";

export type ProQuickAction = {
  id: string;
  title: string;
  desc: string;
  accept: string;
  target: ProTargetFormat;
  icon: typeof FileText;
};

export const PRO_QUICK_ACTIONS: ProQuickAction[] = [
  {
    id: "legacy-word",
    title: "Word 레거시 → DOCX",
    desc: ".doc · .dot",
    accept: ".doc,.dot",
    target: "docx",
    icon: FileText,
  },
  {
    id: "legacy-excel",
    title: "Excel 레거시 → XLSX",
    desc: ".xls · .xlt",
    accept: ".xls,.xlt",
    target: "xlsx",
    icon: Sheet,
  },
  {
    id: "legacy-ppt",
    title: "PPT 레거시 → PPTX",
    desc: ".ppt · .pps",
    accept: ".ppt,.pps,.pot",
    target: "pptx",
    icon: Presentation,
  },
  {
    id: "any-pdf",
    title: "문서 → PDF",
    desc: "Office · ODF · HWPX",
    accept: ".docx,.xlsx,.pptx,.odt,.hwpx,.hwp",
    target: "pdf",
    icon: FileType,
  },
];

type Props = {
  activeTarget: ProTargetFormat;
  onSelect: (action: ProQuickAction) => void;
};

export default function ProQuickActions({ activeTarget, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {PRO_QUICK_ACTIONS.map((action) => {
        const Icon = action.icon;
        const active = activeTarget === action.target;
        return (
          <button
            key={action.id}
            type="button"
            onClick={() => onSelect(action)}
            className={[
              "rounded-2xl border p-3 text-left transition",
              active
                ? "border-[var(--lofice-gold)] bg-[var(--lofice-gold)]/10 shadow-sm"
                : "border-border bg-card hover:border-primary/30 hover:bg-muted/30",
            ].join(" ")}
          >
            <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
            <p className="mt-2 text-xs font-bold text-foreground">{action.title}</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">{action.desc}</p>
            <p className="mt-1 text-[10px] font-medium text-primary">{PRO_TARGET_LABELS[action.target]}</p>
          </button>
        );
      })}
    </div>
  );
}
