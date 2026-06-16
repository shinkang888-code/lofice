"use client";

import { FileText, Table, Presentation, FileType } from "lucide-react";

const APPS = [
  {
    id: "hwp",
    label: "한글",
    desc: "HWP · HWPX",
    icon: FileText,
    color: "from-[#2b579a] to-[#1e3f6f]",
    formats: ".hwp .hwpx",
  },
  {
    id: "sheet",
    label: "시트",
    desc: "Excel · CSV",
    icon: Table,
    color: "from-[#217346] to-[#185c37]",
    formats: ".xlsx .xls .csv",
  },
  {
    id: "slide",
    label: "슬라이드",
    desc: "PPT · PPTX · ODP",
    icon: Presentation,
    color: "from-[#d24726] to-[#a33b1e]",
    formats: ".ppt .pptx .odp",
  },
  {
    id: "word",
    label: "워드",
    desc: "Word · DOCX",
    icon: FileType,
    color: "from-[#2b579a] to-[#185abd]",
    formats: ".docx .doc",
  },
] satisfies Array<{
  id: string;
  label: string;
  desc: string;
  icon: typeof FileText;
  color: string;
  formats: string;
  soon?: boolean;
}>;

interface Props {
  onOpen: () => void;
}

export default function PolarisAppTiles({ onOpen }: Props) {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {APPS.map(({ id, label, desc, icon: Icon, color, formats }) => (
        <button
          key={id}
          type="button"
          onClick={onOpen}
          className="polaris-app-tile group text-left"
        >
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <p className="font-bold text-white text-sm">{label}</p>
          <p className="text-[11px] text-white/70 mt-0.5">{desc}</p>
          <p className="text-[10px] text-white/50 mt-2">{formats}</p>
        </button>
      ))}
    </section>
  );
}
