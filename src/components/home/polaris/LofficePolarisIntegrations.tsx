"use client";

import { FileText, FileSpreadsheet, Presentation, FileType, Sparkles, Languages } from "lucide-react";

const INTEGRATIONS = [
  { icon: FileType, label: "HWP" },
  { icon: FileText, label: "Word" },
  { icon: FileSpreadsheet, label: "Excel" },
  { icon: Presentation, label: "PPT" },
  { icon: FileText, label: "PDF" },
  { icon: Sparkles, label: "AI" },
  { icon: Languages, label: "OCR" },
];

export default function LofficePolarisIntegrations() {
  return (
    <section className="border-y border-border/50 bg-card/40 py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {INTEGRATIONS.map(({ icon: Icon, label }) => (
            <div key={label} className="group flex flex-col items-center gap-2 transition hover:scale-105">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 bg-background text-muted-foreground shadow-sm transition group-hover:border-primary/30 group-hover:text-primary">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
