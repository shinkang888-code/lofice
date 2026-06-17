"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MoreHorizontal,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Download,
  Share2,
  Save,
  Home,
  ScanLine,
  Bot,
  FileStack,
  X,
  FolderOpen,
} from "lucide-react";
import { useViewerToolbarOptional } from "@/components/office/ViewerToolbarContext";

export type MobileDocChromeProps = {
  fileName: string;
  canEdit?: boolean;
  editHref?: string;
  onShare?: () => void;
  onSave?: () => void;
  saving?: boolean;
  onOpenFile?: () => void;
  onOcr?: () => void;
  ocrActive?: boolean;
  onHwpAi?: () => void;
  hwpAiActive?: boolean;
  pdfEditHref?: string;
  hwpEditHref?: string;
  pptEditHref?: string;
  minimal?: boolean;
};

export function MobileDocChromeTop({ fileName, onMenu }: { fileName: string; onMenu: () => void }) {
  const router = useRouter();
  return (
    <header className="lo-mobile-top safe-top shrink-0">
      <button type="button" onClick={() => router.back()} className="lo-mobile-icon-btn" aria-label="뒤로">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h1 className="lo-mobile-title">{fileName}</h1>
      <button type="button" onClick={onMenu} className="lo-mobile-icon-btn" aria-label="더보기">
        <MoreHorizontal className="h-5 w-5" />
      </button>
    </header>
  );
}

export function MobileDocChromeBottom({
  minimal,
  canEdit,
  editHref,
}: {
  minimal?: boolean;
  canEdit?: boolean;
  editHref?: string;
}) {
  const router = useRouter();
  const toolbar = useViewerToolbarOptional();
  const state = toolbar?.state;
  const actions = state?.actions ?? {};

  if (minimal) return null;

  const isPdf = state?.docType === "pdf";
  const isHwp = state?.docType === "hwp";
  const isPpt = state?.docType === "presentation";
  const canPage = (isPdf || isHwp || isPpt) && state?.canPageNav;
  const zoomPct = Math.round((state?.zoom ?? 1) * 100);

  return (
    <footer className="lo-mobile-bottom safe-bottom shrink-0">
      <div className="lo-mobile-bottom-inner">
        {actions.zoomOut && (
          <button type="button" onClick={actions.zoomOut} className="lo-mobile-action" aria-label="축소">
            <ZoomOut className="h-5 w-5" />
          </button>
        )}
        {canPage ? (
          <>
            <button type="button" onClick={actions.prevPage} className="lo-mobile-action" aria-label="이전">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="lo-mobile-page-pill">
              {state?.page ?? 1} / {state?.pageCount ?? 1}
            </span>
            <button type="button" onClick={actions.nextPage} className="lo-mobile-action" aria-label="다음">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : (
          <span className="lo-mobile-page-pill">{zoomPct}%</span>
        )}
        {actions.zoomIn && (
          <button type="button" onClick={actions.zoomIn} className="lo-mobile-action" aria-label="확대">
            <ZoomIn className="h-5 w-5" />
          </button>
        )}
        {canEdit && editHref && (
          <button
            type="button"
            onClick={() => router.push(editHref)}
            className="lo-mobile-action lo-mobile-action-primary"
            aria-label="편집"
          >
            <Edit3 className="h-5 w-5" />
          </button>
        )}
      </div>
    </footer>
  );
}

export function MobileDocChromeMenu({
  open,
  onClose,
  props,
}: {
  open: boolean;
  onClose: () => void;
  props: MobileDocChromeProps;
}) {
  const router = useRouter();
  const toolbar = useViewerToolbarOptional();
  const actions = toolbar?.state?.actions ?? {};

  const {
    fileName,
    canEdit,
    editHref,
    onShare,
    onSave,
    saving,
    onOpenFile,
    onOcr,
    ocrActive,
    onHwpAi,
    hwpAiActive,
    pdfEditHref,
    hwpEditHref,
    pptEditHref,
  } = props;

  if (!open) return null;

  const close = (fn?: () => void) => {
    fn?.();
    onClose();
  };

  return (
    <div className="lo-mobile-sheet-backdrop" onClick={onClose}>
      <div className="lo-mobile-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="문서 메뉴">
        <div className="lo-mobile-sheet-handle" />
        <div className="flex items-center justify-between px-4 pb-2">
          <p className="truncate text-sm font-semibold text-gray-900">{fileName}</p>
          <button type="button" onClick={onClose} className="lo-mobile-icon-btn">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="lo-mobile-sheet-grid">
          {onOpenFile && <SheetBtn icon={FolderOpen} label="열기" onClick={() => close(onOpenFile)} />}
          {onSave && <SheetBtn icon={Save} label={saving ? "저장 중" : "저장"} onClick={() => close(onSave)} />}
          {actions.download && <SheetBtn icon={Download} label="다운로드" onClick={() => close(actions.download)} />}
          {onShare && <SheetBtn icon={Share2} label="공유" onClick={() => close(onShare)} />}
          {onOcr && <SheetBtn icon={ScanLine} label="OCR" active={ocrActive} onClick={() => close(onOcr)} />}
          {onHwpAi && <SheetBtn icon={Bot} label="한글 AI" active={hwpAiActive} onClick={() => close(onHwpAi)} />}
          {pdfEditHref && <SheetBtn icon={FileStack} label="PDF 편집" onClick={() => close(() => router.push(pdfEditHref))} />}
          {hwpEditHref && <SheetBtn icon={Edit3} label="HWP 편집" onClick={() => close(() => router.push(hwpEditHref))} />}
          {pptEditHref && <SheetBtn icon={Edit3} label="PPT 편집" onClick={() => close(() => router.push(pptEditHref))} />}
          {canEdit && editHref && <SheetBtn icon={Edit3} label="편집" onClick={() => close(() => router.push(editHref))} />}
          <SheetBtn icon={Home} label="홈" onClick={() => close(() => router.push("/"))} />
        </div>
      </div>
    </div>
  );
}

/** LoficeLayout 모바일 크롬 — top / bottom / menu 분리용 훅 */
export function useMobileDocMenu() {
  return useState(false);
}

function SheetBtn({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} className={`lo-mobile-sheet-btn ${active ? "lo-mobile-sheet-btn-active" : ""}`}>
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
}
