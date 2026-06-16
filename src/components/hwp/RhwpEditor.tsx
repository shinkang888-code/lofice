"use client";

import {
  forwardRef, useEffect, useImperativeHandle, useRef, useState,
} from "react";
import { createEditor, type RhwpEditor as RhwpEditorInstance } from "@rhwp/editor";
import { getRhwpStudioUrl } from "@/lib/rhwp/config";
import { Loader2 } from "lucide-react";

export interface RhwpEditorHandle {
  save: () => Promise<ArrayBuffer | null>;
  exportVerify: () => Promise<{ recovered: boolean; pageCountBefore: number; pageCountAfter: number } | null>;
}

interface Props {
  buffer: ArrayBuffer;
  fileName: string;
  onReady?: (pageCount: number) => void;
  onError?: (message: string) => void;
}

/**
 * hwpreader / rhwp-studio 전체 편집 UI (@rhwp/editor iframe)
 * — 메뉴, 툴바, 표·수식·서식, hwpctl 호환, Undo/Redo
 */
const RhwpEditor = forwardRef<RhwpEditorHandle, Props>(function RhwpEditor(
  { buffer, fileName, onReady, onError },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<RhwpEditorInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    async save() {
      const editor = editorRef.current;
      if (!editor) return null;
      const isHwpx = fileName.toLowerCase().endsWith(".hwpx");
      const bytes = isHwpx ? await editor.exportHwpx() : await editor.exportHwp();
      return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
    },
    async exportVerify() {
      const editor = editorRef.current;
      if (!editor) return null;
      try {
        return await editor.exportHwpVerify();
      } catch {
        return null;
      }
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let editor: RhwpEditorInstance | null = null;

    async function mount() {
      if (!container) return;
      setLoading(true);
      setError(null);
      try {
        editor = await createEditor(container, {
          studioUrl: getRhwpStudioUrl(),
          width: "100%",
          height: "100%",
        });
        if (cancelled) {
          editor.destroy();
          return;
        }
        editorRef.current = editor;
        const result = await editor.loadFile(buffer, fileName);
        if (!cancelled) {
          onReady?.(result.pageCount);
          setLoading(false);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "HWP 에디터 초기화 실패";
        if (!cancelled) {
          setError(msg);
          onError?.(msg);
          setLoading(false);
        }
      }
    }

    mount();
    return () => {
      cancelled = true;
      editor?.destroy();
      editorRef.current = null;
    };
  }, [buffer, fileName, onReady, onError]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 px-6 text-center">
        <p className="text-red-600 font-medium">HWP 에디터 오류</p>
        <p className="text-sm text-gray-600">{error}</p>
        <p className="text-xs text-gray-400 mt-2">
          rhwp-studio URL: {getRhwpStudioUrl()}
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#f3f3f3]">
          <Loader2 className="w-8 h-8 text-lofice-navy animate-spin" />
          <p className="text-sm text-gray-600">hwpreader 에디터 로딩 중...</p>
        </div>
      )}
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
});

export default RhwpEditor;
