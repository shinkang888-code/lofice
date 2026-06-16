"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import {
  Loader2, RotateCw, Trash2, Scissors, FileStack, Download,
  Save, ChevronUp, ChevronDown, ExternalLink,
} from "lucide-react";
import { openPdfDocument } from "@/lib/pdf/pdf-engine";
import { formatPageRange } from "@/lib/pdf/page-range";
import {
  deletePages, extractPages, reorderPages, downloadStirlingResult,
  type StirlingToolResult,
} from "@/lib/pdf/stirling-tools";
import { stirlingMergePdfs, stirlingRotatePdf, stirlingSplitPages } from "@/lib/pdf/stirling-api";
import { isStirlingServerAvailable } from "@/lib/pdf/stirling-config";

interface Props {
  buffer: ArrayBuffer;
  fileName: string;
  onBufferChange?: (buffer: ArrayBuffer, fileName?: string) => void;
  onSave?: (buffer: ArrayBuffer) => Promise<void>;
}

export default function PdfEditorPanel({ buffer, fileName, onBufferChange, onSave }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const mergeInputRef = useRef<HTMLInputElement>(null);

  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [thumbUrls, setThumbUrls] = useState<string[]>([]);
  const [pageSpec, setPageSpec] = useState("");

  const selectedSpec = selected.size > 0 ? formatPageRange([...selected]) : pageSpec;

  useEffect(() => {
    let cancelled = false;
    let pdf: PDFDocumentProxy | null = null;

    async function load() {
      setLoading(true);
      setError(null);
      setSelected(new Set());
      setThumbUrls([]);

      try {
        pdf = await openPdfDocument(buffer);
        if (cancelled) { pdf.destroy(); return; }
        setPdfDoc(pdf);
        setPageCount(pdf.numPages);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "PDF를 열 수 없습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; pdf?.destroy(); };
  }, [buffer]);

  useEffect(() => {
    const pdf = pdfDoc;
    if (!pdf || pageCount === 0) return;

    let cancelled = false;
    async function buildThumbs() {
      const urls: string[] = [];
      for (let i = 1; i <= pageCount; i++) {
        if (cancelled) break;
        const page = await pdf!.getPage(i);
        const vp = page.getViewport({ scale: 0.2 });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport: vp }).promise;
          urls.push(canvas.toDataURL("image/jpeg", 0.65));
        }
        page.cleanup();
      }
      if (!cancelled) setThumbUrls(urls);
    }
    buildThumbs();
    return () => { cancelled = true; };
  }, [pdfDoc, pageCount]);

  const applyResult = useCallback(async (result: StirlingToolResult, saveToDoc = true) => {
    if (result.kind === "zip") {
      await downloadStirlingResult(result);
      return;
    }
    if (saveToDoc && onBufferChange) {
      const ab = result.bytes.buffer.slice(
        result.bytes.byteOffset,
        result.bytes.byteOffset + result.bytes.byteLength,
      ) as ArrayBuffer;
      onBufferChange(ab, result.fileName);
    } else {
      await downloadStirlingResult(result);
    }
  }, [onBufferChange]);

  const runTool = useCallback(async (fn: () => Promise<StirlingToolResult>, saveToDoc = true) => {
    setBusy(true);
    setError(null);
    try {
      const result = await fn();
      await applyResult(result, saveToDoc);
    } catch (e) {
      setError(e instanceof Error ? e.message : "작업 실패");
    } finally {
      setBusy(false);
    }
  }, [applyResult]);

  const togglePage = (n: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(Array.from({ length: pageCount }, (_, i) => i + 1)));
  const clearSelection = () => setSelected(new Set());

  const movePage = (n: number, dir: -1 | 1) => {
    const order = Array.from({ length: pageCount }, (_, i) => i + 1);
    const idx = order.indexOf(n);
    const target = idx + dir;
    if (target < 0 || target >= order.length) return;
    [order[idx], order[target]] = [order[target], order[idx]];
    runTool(() => reorderPages(buffer, order, fileName));
  };

  const handleMerge = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    e.target.value = "";
    setBusy(true);
    setError(null);
    try {
      const inputs = [{ bytes: buffer, name: fileName }];
      for (const f of Array.from(files)) {
        inputs.push({ bytes: await f.arrayBuffer(), name: f.name });
      }
      const result = await stirlingMergePdfs(inputs, `merged_${fileName}`);
      await applyResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "병합 실패");
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async () => {
    if (onSave) {
      setBusy(true);
      try { await onSave(buffer); } catch (e) {
        setError(e instanceof Error ? e.message : "저장 실패");
      } finally { setBusy(false); }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 bg-[#525659]">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
        <p className="text-sm text-white/80">PDF 편집기 준비 중...</p>
      </div>
    );
  }

  if (error && !pdfDoc) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 px-6 bg-[#525659] text-red-300">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full bg-[#525659]">
      <div className="shrink-0 bg-[#2b2d30] border-b border-black/30 px-3 py-2 flex flex-wrap gap-2 items-center">
        <ToolBtn
          icon={RotateCw}
          label="90° 회전"
          disabled={busy}
          onClick={() => runTool(() => stirlingRotatePdf(buffer, 90, fileName))}
        />
        <ToolBtn
          icon={Scissors}
          label="분할"
          disabled={busy || !selectedSpec}
          onClick={() => runTool(() => stirlingSplitPages(buffer, selectedSpec || "all", fileName), false)}
        />
        <ToolBtn
          icon={FileStack}
          label="추출"
          disabled={busy || !selectedSpec}
          onClick={() => runTool(() => extractPages(buffer, selectedSpec, fileName))}
        />
        <ToolBtn
          icon={Trash2}
          label="삭제"
          disabled={busy || !selectedSpec}
          onClick={() => runTool(() => deletePages(buffer, selectedSpec, fileName))}
        />
        <ToolBtn
          icon={FileStack}
          label="병합"
          disabled={busy}
          onClick={() => mergeInputRef.current?.click()}
        />
        <input ref={mergeInputRef} type="file" accept=".pdf,application/pdf" multiple className="hidden" onChange={handleMerge} />

        <div className="h-6 w-px bg-white/20 mx-1" />

        <input
          type="text"
          value={pageSpec}
          onChange={(e) => setPageSpec(e.target.value)}
          placeholder="1-3,5"
          className="text-xs bg-[#1e1f22] text-white border border-white/20 rounded px-2 py-1 w-24"
          title="페이지 범위 (Stirling split-pages 형식)"
        />
        <button type="button" onClick={selectAll} className="text-[10px] text-white/70 hover:text-white px-1">전체</button>
        <button type="button" onClick={clearSelection} className="text-[10px] text-white/70 hover:text-white px-1">해제</button>

        <div className="flex-1" />

        {onSave && (
          <ToolBtn icon={Save} label="저장" disabled={busy} onClick={handleSave} />
        )}
        <ToolBtn
          icon={Download}
          label="다운로드"
          disabled={busy}
          onClick={() => {
            const blob = new Blob([buffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
          }}
        />

        {isStirlingServerAvailable() && (
          <span className="text-[10px] text-emerald-400/90 flex items-center gap-1">
            <ExternalLink className="w-3 h-3" /> Stirling 서버
          </span>
        )}
      </div>

      {error && (
        <div className="shrink-0 bg-red-900/40 text-red-200 text-xs px-3 py-1">{error}</div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 max-w-6xl mx-auto">
          {thumbUrls.map((url, i) => {
            const pageNum = i + 1;
            const isSelected = selected.has(pageNum);
            return (
              <div
                key={pageNum}
                className={`relative rounded overflow-hidden border-2 transition-colors ${
                  isSelected ? "border-[#2b579a]" : "border-transparent"
                }`}
              >
                <button
                  type="button"
                  onClick={() => togglePage(pageNum)}
                  className="block w-full"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`${pageNum}페이지`} className="w-full bg-white" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] py-0.5 text-center">
                    {pageNum}
                  </span>
                </button>
                <div className="absolute top-1 right-1 flex flex-col gap-0.5">
                  <button
                    type="button"
                    disabled={busy || pageNum === 1}
                    onClick={() => movePage(pageNum, -1)}
                    className="p-0.5 bg-black/50 rounded text-white disabled:opacity-30"
                    title="위로"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    disabled={busy || pageNum === pageCount}
                    onClick={() => movePage(pageNum, 1)}
                    className="p-0.5 bg-black/50 rounded text-white disabled:opacity-30"
                    title="아래로"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
                {isSelected && (
                  <div className="absolute top-1 left-1 w-4 h-4 bg-[#2b579a] rounded-full border-2 border-white" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {busy && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      )}
    </div>
  );
}

function ToolBtn({
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || !onClick}
      className="flex flex-col items-center gap-0.5 px-2 py-1 rounded hover:bg-white/10 text-white/90 disabled:opacity-40 text-[10px] min-w-[52px]"
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
