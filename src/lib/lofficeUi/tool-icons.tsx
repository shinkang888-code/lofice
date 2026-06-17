import {
  Archive,
  ArrowLeftRight,
  Bot,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType,
  FolderOpen,
  Image,
  Info,
  Languages,
  Lock,
  Merge,
  MessageSquare,
  Package,
  PenLine,
  Presentation,
  ScanText,
  Search,
  Shield,
  Sparkles,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import type { LofficeTool } from "./tools";

export type ToolIconStyle = {
  Icon: LucideIcon;
  bg: string;
  fg: string;
};

const DEFAULT: ToolIconStyle = {
  Icon: FileText,
  bg: "bg-primary/10",
  fg: "text-primary",
};

const MAP: Record<string, ToolIconStyle> = {
  "PDF 뷰어": { Icon: FileText, bg: "bg-red-500/10", fg: "text-red-600 dark:text-red-400" },
  "PDF 편집": { Icon: PenLine, bg: "bg-red-500/10", fg: "text-red-600 dark:text-red-400" },
  "Word 편집기": { Icon: FileType, bg: "bg-blue-500/10", fg: "text-blue-600 dark:text-blue-400" },
  "Excel 편집기": { Icon: FileSpreadsheet, bg: "bg-emerald-500/10", fg: "text-emerald-600 dark:text-emerald-400" },
  "PowerPoint 편집기": { Icon: Presentation, bg: "bg-orange-500/10", fg: "text-orange-600 dark:text-orange-400" },
  "한글(HWP) 뷰어": { Icon: FileText, bg: "bg-sky-500/10", fg: "text-sky-600 dark:text-sky-400" },
  "PDF 병합/분할": { Icon: Merge, bg: "bg-violet-500/10", fg: "text-violet-600 dark:text-violet-400" },
  "7-Zip 아카이브": { Icon: Archive, bg: "bg-amber-500/10", fg: "text-amber-600 dark:text-amber-400" },
  "문서 변환": { Icon: ArrowLeftRight, bg: "bg-indigo-500/10", fg: "text-indigo-600 dark:text-indigo-400" },
  "PDF → Excel": { Icon: FileSpreadsheet, bg: "bg-emerald-500/10", fg: "text-emerald-600 dark:text-emerald-400" },
  "이미지 뷰어": { Icon: Image, bg: "bg-pink-500/10", fg: "text-pink-600 dark:text-pink-400" },
  "HWP → PDF": { Icon: FileText, bg: "bg-sky-500/10", fg: "text-sky-600 dark:text-sky-400" },
  "OCR 텍스트 추출": { Icon: ScanText, bg: "bg-cyan-500/10", fg: "text-cyan-600 dark:text-cyan-400" },
  "ZIP 문서 묶음": { Icon: Package, bg: "bg-amber-500/10", fg: "text-amber-600 dark:text-amber-400" },
  "PPT AI 생성": { Icon: Sparkles, bg: "bg-violet-500/10", fg: "text-violet-600 dark:text-violet-400" },
  "HWP AI": { Icon: Bot, bg: "bg-sky-500/10", fg: "text-sky-600 dark:text-sky-400" },
  "문서 기반 작업": { Icon: MessageSquare, bg: "bg-blue-500/10", fg: "text-blue-600 dark:text-blue-400" },
  "GPT Generator PPT": { Icon: Wand2, bg: "bg-fuchsia-500/10", fg: "text-fuchsia-600 dark:text-fuchsia-400" },
  "PPT 텍스트 추출": { Icon: Search, bg: "bg-orange-500/10", fg: "text-orange-600 dark:text-orange-400" },
  "Office 암·복호화": { Icon: Lock, bg: "bg-slate-500/10", fg: "text-slate-600 dark:text-slate-300" },
  "문서 메타데이터": { Icon: Info, bg: "bg-slate-500/10", fg: "text-slate-600 dark:text-slate-300" },
  "도구 상자": { Icon: FolderOpen, bg: "bg-amber-500/10", fg: "text-amber-600 dark:text-amber-400" },
  "Office → lofice": { Icon: Shield, bg: "bg-emerald-500/10", fg: "text-emerald-600 dark:text-emerald-400" },
};

export function getToolIconStyle(tool: LofficeTool): ToolIconStyle {
  return MAP[tool.name] ?? DEFAULT;
}

export const CATEGORY_ACCENT: Record<LofficeTool["category"], string> = {
  doc: "from-blue-500/80 to-primary",
  ai: "from-violet-500/80 to-fuchsia-500/80",
  convert: "from-amber-500/80 to-orange-500/80",
  analyze: "from-emerald-500/80 to-teal-500/80",
};

export const POPULAR_TOOL_NAMES = ["HWP AI", "PDF 편집", "PPT AI 생성", "문서 변환"] as const;
