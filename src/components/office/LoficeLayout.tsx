"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft, Edit3, Share2, Save, FileText, Home, Eye,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  ImageIcon, Table, FileCode, ZoomIn, ZoomOut, Maximize2,
  Download, Printer, ChevronLeft, ChevronRight, LayoutGrid,
  FolderOpen, Copy, Scissors, ClipboardPaste, Undo2, Redo2,
  Link2, Minus, Plus, ScanLine, FileStack, Layers, ExternalLink, Bot,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useViewerToolbarOptional } from "./ViewerToolbarContext";
import { useEditorToolbarOptional } from "./EditorToolbarContext";
import { copySelectionToClipboard, printDocument } from "@/lib/office/ribbon-defaults";

type RibbonTab = "file" | "home" | "insert" | "view" | "pdf";
type PdfEditorMode = "tools" | "stirling" | "split";

interface Props {
  fileName: string;
  canEdit?: boolean;
  editHref?: string;
  onShare?: () => void;
  onSave?: () => void;
  onOpenFile?: () => void;
  saving?: boolean;
  /** 내장 툴바 에디터(eigenpal) 사용 시 리본 숨김 */
  minimal?: boolean;
  /** OCR 텍스트 추출 패널 토글 */
  onOcr?: () => void;
  ocrActive?: boolean;
  /** PDF 편집기 전용 레이아웃 */
  pdfEditMode?: boolean;
  pdfEditorMode?: PdfEditorMode;
  onPdfEditorModeChange?: (mode: PdfEditorMode) => void;
  stirlingAvailable?: boolean;
  /** PDF 편집기 → 뷰어 */
  viewerHref?: string;
  /** PDF 뷰어 → 편집기 */
  pdfEditHref?: string;
  /** HWP 편집기 전용 (rhwp-studio iframe) */
  hwpEditMode?: boolean;
  /** HWP 뷰어 → hwpreader 편집기 */
  hwpEditHref?: string;
  /** PPT 편집기 전용 */
  pptEditMode?: boolean;
  /** PPT 뷰어 → ppt-master 편집기 */
  pptEditHref?: string;
  /** hwpx-skill AI 패널 토글 */
  onHwpAi?: () => void;
  hwpAiActive?: boolean;
  children: React.ReactNode;
}

export default function LoficeLayout({
  fileName,
  canEdit,
  editHref,
  onShare,
  onSave,
  onOpenFile,
  saving,
  minimal = false,
  onOcr,
  ocrActive = false,
  pdfEditMode = false,
  pdfEditorMode = "tools",
  onPdfEditorModeChange,
  stirlingAvailable = false,
  viewerHref,
  pdfEditHref,
  hwpEditMode = false,
  hwpEditHref,
  pptEditMode = false,
  pptEditHref,
  onHwpAi,
  hwpAiActive = false,
  children,
}: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<RibbonTab>(pdfEditMode ? "pdf" : "home");
  const toolbar = useViewerToolbarOptional();
  const editorToolbar = useEditorToolbarOptional();
  const { state } = toolbar ?? { state: null };
  const viewActions = state?.actions ?? {};
  const editActions = editorToolbar?.actions ?? {};
  const editMeta = editorToolbar?.meta ?? {};
  const actions = {
    copy: viewActions.copy ?? editActions.copy ?? copySelectionToClipboard,
    cut: viewActions.cut ?? editActions.cut,
    paste: viewActions.paste ?? editActions.paste,
    undo: viewActions.undo ?? editActions.undo,
    redo: viewActions.redo ?? editActions.redo,
    bold: viewActions.bold ?? editActions.bold,
    italic: viewActions.italic ?? editActions.italic,
    underline: viewActions.underline ?? editActions.underline,
    alignLeft: viewActions.alignLeft ?? editActions.alignLeft,
    alignCenter: viewActions.alignCenter ?? editActions.alignCenter,
    alignRight: viewActions.alignRight ?? editActions.alignRight,
    zoomIn: viewActions.zoomIn,
    zoomOut: viewActions.zoomOut,
    zoomFit: viewActions.zoomFit,
    zoomReset: viewActions.zoomReset,
    prevPage: viewActions.prevPage,
    nextPage: viewActions.nextPage,
    download: viewActions.download,
    print: viewActions.print ?? printDocument,
    toggleThumbnails: viewActions.toggleThumbnails,
  };
  const isPdf = state?.docType === "pdf";
  const isHwp = state?.docType === "hwp";
  const isPpt = state?.docType === "presentation";
  const zoomPct = Math.round((state?.zoom ?? 1) * 100);

  const tabs: { id: RibbonTab; label: string }[] = pdfEditMode
    ? [
        { id: "file", label: "파일" },
        { id: "pdf", label: "PDF" },
        { id: "view", label: "보기" },
      ]
    : [
        { id: "file", label: "파일" },
        { id: "home", label: "홈" },
        { id: "insert", label: "삽입" },
        { id: "view", label: "보기" },
      ];

  return (
    <div className="flex flex-col h-[100dvh] bg-[#f3f3f3] select-none">
      {/* 타이틀 바 — 폴라리스 오피스 웹 스타일 */}
      <div className="h-9 bg-[#2b579a] flex items-center px-3 text-white text-xs shrink-0 safe-top">
        <Image src="/lofice-icon.png" alt="lofice" width={18} height={18} className="w-[18px] h-[18px] rounded-sm mr-2" />
        <span className="font-semibold tracking-wide">lofice</span>
        <span className="mx-2 opacity-40">|</span>
        <span className="truncate opacity-90 flex-1">{fileName}</span>
        <span className="text-[10px] opacity-60 hidden sm:inline">로피스 웹 오피스</span>
      </div>

      {/* 리본 탭 */}
      <div className="bg-[#2b579a] shrink-0 border-b border-[#1e3f6f]">
        <div className="flex items-center px-1 h-8 gap-0.5 overflow-x-auto scrollbar-thin">
          <button onClick={() => router.back()} className="p-1.5 text-white/80 hover:bg-white/10 rounded shrink-0" title="뒤로">
            <ArrowLeft className="w-4 h-4" />
          </button>
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-1 text-xs font-medium rounded-t transition-colors shrink-0 ${
                tab === id ? "bg-[#f3f3f3] text-[#2b579a]" : "text-white/90 hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
          <div className="flex-1 min-w-2" />
          {onSave && (
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded shrink-0 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" /> {saving ? "저장 중" : "저장"}
            </button>
          )}
          {canEdit && editHref && (
            <button
              onClick={() => router.push(editHref)}
              className="flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" /> 편집
            </button>
          )}
          {pdfEditHref && !pdfEditMode && (
            <button
              onClick={() => router.push(pdfEditHref)}
              className="flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded shrink-0"
            >
              <FileStack className="w-3.5 h-3.5" /> PDF 편집
            </button>
          )}
          {hwpEditHref && !hwpEditMode && (
            <button
              onClick={() => router.push(hwpEditHref)}
              className="flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" /> HWP 편집
            </button>
          )}
          {pptEditHref && !pptEditMode && (
            <button
              onClick={() => router.push(pptEditHref)}
              className="flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" /> PPT 편집
            </button>
          )}
          {viewerHref && (pdfEditMode || hwpEditMode || pptEditMode) && (
            <button
              onClick={() => router.push(viewerHref)}
              className="flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded shrink-0"
            >
              <Eye className="w-3.5 h-3.5" /> 뷰어
            </button>
          )}
        </div>
      </div>

      {/* 리본 패널 */}
      {!minimal && (
      <div className="bg-[#f3f3f3] border-b border-gray-300 px-2 py-1.5 shrink-0 min-h-[76px] overflow-x-auto ribbon-panel">
        {tab === "file" && (
          <div className="flex gap-4 text-xs min-w-max">
            <RibbonGroup label="파일">
              <RibbonBtn icon={FileText} label="새 문서" onClick={() => router.push("/")} />
              <RibbonBtn icon={FolderOpen} label="열기" onClick={onOpenFile ?? (() => router.push("/files/"))} />
              {onSave && <RibbonBtn icon={Save} label="저장" onClick={onSave} />}
              <RibbonBtn icon={Download} label="다운로드" onClick={actions.download} disabled={!actions.download} />
              <RibbonBtn icon={Printer} label="인쇄" onClick={actions.print} disabled={!actions.print} />
            </RibbonGroup>
            <RibbonGroup label="공유">
              <RibbonBtn icon={Share2} label="공유" onClick={onShare} disabled={!onShare} />
            </RibbonGroup>
          </div>
        )}
        {tab === "home" && (
          <div className="flex gap-4 text-xs min-w-max">
            <RibbonGroup label="클립보드">
              <RibbonBtn icon={Copy} label="복사" onClick={actions.copy} />
              <RibbonBtn icon={Scissors} label="잘라내기" onClick={actions.cut} />
              <RibbonBtn icon={ClipboardPaste} label="붙여넣기" onClick={actions.paste} />
            </RibbonGroup>
            <RibbonGroup label="편집">
              <RibbonBtn icon={Undo2} label="실행 취소" onClick={actions.undo} />
              <RibbonBtn icon={Redo2} label="다시 실행" onClick={actions.redo} />
            </RibbonGroup>
            <RibbonGroup label="글꼴">
              <RibbonBtn icon={Bold} label="굵게" onClick={actions.bold} />
              <RibbonBtn icon={Italic} label="기울임" onClick={actions.italic} />
              <RibbonBtn icon={Underline} label="밑줄" onClick={actions.underline} />
            </RibbonGroup>
            <RibbonGroup label="단락">
              <RibbonBtn icon={AlignLeft} label="왼쪽" onClick={actions.alignLeft} />
              <RibbonBtn icon={AlignCenter} label="가운데" onClick={actions.alignCenter} />
              <RibbonBtn icon={AlignRight} label="오른쪽" onClick={actions.alignRight} />
            </RibbonGroup>
            {canEdit && editHref && (
              <RibbonGroup label="모드">
                <RibbonBtn icon={Edit3} label="편집" onClick={() => router.push(editHref)} />
              </RibbonGroup>
            )}
          </div>
        )}
        {tab === "insert" && (
          <div className="flex gap-4 text-xs min-w-max">
            <RibbonGroup label="삽입">
              <RibbonBtn icon={ImageIcon} label="이미지" />
              <RibbonBtn icon={Table} label="표" />
              <RibbonBtn icon={Link2} label="하이퍼링크" />
              <RibbonBtn icon={FileCode} label="코드" />
              <RibbonBtn icon={Minus} label="구분선" />
            </RibbonGroup>
          </div>
        )}
        {tab === "view" && (
          <div className="flex gap-4 text-xs min-w-max">
            {!pdfEditMode && (
              <>
                <RibbonGroup label="확대/축소">
                  <RibbonBtn icon={ZoomOut} label="축소" onClick={actions.zoomOut} disabled={!actions.zoomOut} />
                  <RibbonBtn icon={ZoomIn} label="확대" onClick={actions.zoomIn} disabled={!actions.zoomIn} />
                  <RibbonBtn icon={Maximize2} label="페이지 맞춤" onClick={actions.zoomFit} disabled={!actions.zoomFit} />
                  <RibbonBtn icon={Plus} label="125%" onClick={actions.zoomReset} disabled={!actions.zoomReset} />
                </RibbonGroup>
                {(isPdf || isHwp || isPpt) && state?.canPageNav && (
                  <RibbonGroup label="페이지">
                    <RibbonBtn icon={ChevronLeft} label="이전" onClick={actions.prevPage} />
                    <RibbonBtn icon={ChevronRight} label="다음" onClick={actions.nextPage} />
                    {isPdf && (
                      <RibbonBtn icon={LayoutGrid} label="썸네일" onClick={actions.toggleThumbnails} active={state.showThumbnails} />
                    )}
                  </RibbonGroup>
                )}
              </>
            )}
            <RibbonGroup label="창">
              {onOcr && (
                <RibbonBtn icon={ScanLine} label="OCR" onClick={onOcr} active={ocrActive} />
              )}
              {pdfEditHref && isPdf && (
                <RibbonBtn icon={FileStack} label="PDF 편집" onClick={() => router.push(pdfEditHref)} />
              )}
              {hwpEditHref && isHwp && (
                <RibbonBtn icon={Edit3} label="HWP 편집" onClick={() => router.push(hwpEditHref)} />
              )}
              {onHwpAi && isHwp && (
                <RibbonBtn icon={Bot} label="한글 AI" onClick={onHwpAi} active={hwpAiActive} />
              )}
              {pptEditHref && isPpt && (
                <RibbonBtn icon={Edit3} label="PPT 편집" onClick={() => router.push(pptEditHref)} />
              )}
              {viewerHref && (
                <RibbonBtn icon={Eye} label="뷰어" onClick={() => router.push(viewerHref)} />
              )}
              <RibbonBtn icon={Eye} label="읽기 모드" />
              <RibbonBtn icon={Home} label="홈" onClick={() => router.push("/")} />
            </RibbonGroup>
          </div>
        )}
        {tab === "pdf" && pdfEditMode && (
          <div className="flex gap-4 text-xs min-w-max">
            <RibbonGroup label="Stirling-PDF">
              <RibbonBtn
                icon={Layers}
                label="페이지 도구"
                active={pdfEditorMode === "tools"}
                onClick={() => onPdfEditorModeChange?.("tools")}
              />
              {stirlingAvailable && (
                <RibbonBtn
                  icon={ExternalLink}
                  label="Stirling UI"
                  active={pdfEditorMode === "stirling"}
                  onClick={() => onPdfEditorModeChange?.("stirling")}
                />
              )}
            </RibbonGroup>
          </div>
        )}
      </div>
      )}

      <main className="flex-1 overflow-hidden min-h-0">{children}</main>

      {/* 상태 표시줄 — 폴라리스 스타일 */}
      <footer className="shrink-0 h-6 bg-[#2b579a] text-white text-[10px] flex items-center px-3 justify-between border-t border-[#1e3f6f]">
        <div className="flex items-center gap-3">
          {isPdf && state && (
            <span>
              페이지 {state.page} / {state.pageCount}
            </span>
          )}
          {isHwp && state && (
            <span>
              페이지 {state.page} / {state.pageCount}
            </span>
          )}
          {isPpt && state && (
            <span>
              슬라이드 {state.page} / {state.pageCount}
            </span>
          )}
          {editMeta.docType === "spreadsheet" && editMeta.activeCell && (
            <span>{editMeta.activeCell}{editMeta.sheetName ? ` · ${editMeta.sheetName}` : ""}</span>
          )}
          <span className="opacity-70">
            {isPdf ? "PDF" : isHwp ? "HWP" : isPpt ? "PPT" : editMeta.docType === "spreadsheet" ? "시트" : editMeta.docType === "richtext" ? "한글" : "문서"}
          </span>
        </div>
        <div className="flex items-center gap-3 opacity-90">
          <span>{zoomPct}%</span>
          <span className="truncate max-w-[40vw]">{fileName}</span>
        </div>
      </footer>
    </div>
  );
}

function RibbonGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col border-r border-gray-300 pr-3 last:border-0 shrink-0">
      <div className="flex gap-0.5 mb-0.5">{children}</div>
      <span className="text-[10px] text-gray-500 text-center leading-none">{label}</span>
    </div>
  );
}

function RibbonBtn({
  icon: Icon,
  label,
  onClick,
  disabled,
  active,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || !onClick}
      className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded min-w-[48px] transition-colors ${
        active
          ? "bg-[#2b579a]/15 text-[#2b579a]"
          : disabled || !onClick
            ? "opacity-40 cursor-default"
            : "hover:bg-gray-200 text-gray-700"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] whitespace-nowrap leading-none">{label}</span>
    </button>
  );
}
