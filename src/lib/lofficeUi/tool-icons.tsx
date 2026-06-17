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
  pdfViewer: { Icon: FileText, bg: "bg-red-500/10", fg: "text-red-600 dark:text-red-400" },
  pdfEdit: { Icon: PenLine, bg: "bg-red-500/10", fg: "text-red-600 dark:text-red-400" },
  wordEditor: { Icon: FileType, bg: "bg-blue-500/10", fg: "text-blue-600 dark:text-blue-400" },
  excelEditor: { Icon: FileSpreadsheet, bg: "bg-emerald-500/10", fg: "text-emerald-600 dark:text-emerald-400" },
  pptEditor: { Icon: Presentation, bg: "bg-orange-500/10", fg: "text-orange-600 dark:text-orange-400" },
  hwpViewer: { Icon: FileText, bg: "bg-sky-500/10", fg: "text-sky-600 dark:text-sky-400" },
  pdfMergeSplit: { Icon: Merge, bg: "bg-violet-500/10", fg: "text-violet-600 dark:text-violet-400" },
  zipArchive: { Icon: Archive, bg: "bg-amber-500/10", fg: "text-amber-600 dark:text-amber-400" },
  docConvert: { Icon: ArrowLeftRight, bg: "bg-indigo-500/10", fg: "text-indigo-600 dark:text-indigo-400" },
  pdfToExcel: { Icon: FileSpreadsheet, bg: "bg-emerald-500/10", fg: "text-emerald-600 dark:text-emerald-400" },
  imageViewer: { Icon: Image, bg: "bg-pink-500/10", fg: "text-pink-600 dark:text-pink-400" },
  hwpToPdf: { Icon: FileText, bg: "bg-sky-500/10", fg: "text-sky-600 dark:text-sky-400" },
  ocrExtract: { Icon: ScanText, bg: "bg-cyan-500/10", fg: "text-cyan-600 dark:text-cyan-400" },
  zipBundle: { Icon: Package, bg: "bg-amber-500/10", fg: "text-amber-600 dark:text-amber-400" },
  pptAi: { Icon: Sparkles, bg: "bg-violet-500/10", fg: "text-violet-600 dark:text-violet-400" },
  hwpAi: { Icon: Bot, bg: "bg-sky-500/10", fg: "text-sky-600 dark:text-sky-400" },
  docChat: { Icon: MessageSquare, bg: "bg-blue-500/10", fg: "text-blue-600 dark:text-blue-400" },
  gptPpt: { Icon: Wand2, bg: "bg-fuchsia-500/10", fg: "text-fuchsia-600 dark:text-fuchsia-400" },
  pptTextExtract: { Icon: Search, bg: "bg-orange-500/10", fg: "text-orange-600 dark:text-orange-400" },
  officeCrypto: { Icon: Lock, bg: "bg-slate-500/10", fg: "text-slate-600 dark:text-slate-300" },
  docMetadata: { Icon: Info, bg: "bg-slate-500/10", fg: "text-slate-600 dark:text-slate-300" },
  toolbox: { Icon: FolderOpen, bg: "bg-amber-500/10", fg: "text-amber-600 dark:text-amber-400" },
  officeMigrate: { Icon: Shield, bg: "bg-emerald-500/10", fg: "text-emerald-600 dark:text-emerald-400" },
};

export function getToolIconStyle(tool: LofficeTool): ToolIconStyle {
  return MAP[tool.id] ?? DEFAULT;
}

export const CATEGORY_ACCENT: Record<LofficeTool["category"], string> = {
  doc: "from-blue-500/80 to-primary",
  ai: "from-violet-500/80 to-fuchsia-500/80",
  convert: "from-amber-500/80 to-orange-500/80",
  analyze: "from-emerald-500/80 to-teal-500/80",
};

export const POPULAR_TOOL_NAMES = ["hwpAi", "pdfEdit", "pptAi", "docConvert"] as const;
