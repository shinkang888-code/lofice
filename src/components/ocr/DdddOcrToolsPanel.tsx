"use client";

import { useCallback, useState } from "react";
import { Crosshair, Loader2, Puzzle } from "lucide-react";
import {
  ddddocrDetectBuffer,
  ddddocrSlideComparison,
  ddddocrSlideMatch,
  type DdddOcrDetectionResult,
  type DdddOcrSlideResult,
} from "@/lib/documentOcr/ddddocr-api";

interface Props {
  imageBuffer?: ArrayBuffer;
  className?: string;
}

type ToolMode = "detect" | "slide-match" | "slide-comparison";

async function readFileBuffer(file: File): Promise<ArrayBuffer> {
  return file.arrayBuffer();
}

/** ddddocr 고급 도구 — 목표 검출·슬라이드 캡차 */
export default function DdddOcrToolsPanel({ imageBuffer, className = "" }: Props) {
  const [mode, setMode] = useState<ToolMode>("detect");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detResult, setDetResult] = useState<DdddOcrDetectionResult | null>(null);
  const [slideResult, setSlideResult] = useState<DdddOcrSlideResult | null>(null);
  const [targetFile, setTargetFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [simpleTarget, setSimpleTarget] = useState(false);

  const runDetect = useCallback(async () => {
    if (!imageBuffer) {
      setError("현재 문서 이미지가 없습니다.");
      return;
    }
    setLoading(true);
    setError(null);
    setDetResult(null);
    try {
      const res = await ddddocrDetectBuffer(imageBuffer);
      setDetResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "목표 검출 실패");
    } finally {
      setLoading(false);
    }
  }, [imageBuffer]);

  const runSlide = useCallback(async () => {
    if (!targetFile || !backgroundFile) {
      setError("슬라이드·배경 이미지를 모두 선택하세요.");
      return;
    }
    setLoading(true);
    setError(null);
    setSlideResult(null);
    try {
      const [target, background] = await Promise.all([
        readFileBuffer(targetFile),
        readFileBuffer(backgroundFile),
      ]);
      const res =
        mode === "slide-match"
          ? await ddddocrSlideMatch(target, background, simpleTarget)
          : await ddddocrSlideComparison(target, background);
      setSlideResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "슬라이드 분석 실패");
    } finally {
      setLoading(false);
    }
  }, [backgroundFile, mode, simpleTarget, targetFile]);

  return (
    <div className={`border-t border-gray-200 pt-3 space-y-3 ${className}`}>
      <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
        <Puzzle className="w-3.5 h-3.5 text-[#2b579a]" />
        ddddocr 고급 도구
      </div>

      <div className="flex flex-wrap gap-1">
        {(
          [
            ["detect", "목표 검출"],
            ["slide-match", "슬라이드 매칭"],
            ["slide-comparison", "슬라이드 비교"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setMode(id);
              setError(null);
            }}
            className={`px-2 py-1 text-[10px] rounded border ${
              mode === id
                ? "bg-[#2b579a] text-white border-[#2b579a]"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "detect" ? (
        <div className="space-y-2">
          <p className="text-[10px] text-gray-500">현재 열린 이미지·PDF 페이지에서 문자 영역을 검출합니다.</p>
          <button
            type="button"
            disabled={loading || !imageBuffer}
            onClick={() => void runDetect()}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs bg-gray-800 text-white rounded hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crosshair className="w-3.5 h-3.5" />}
            목표 검출 실행
          </button>
          {detResult && (
            <pre className="text-[10px] bg-gray-50 p-2 rounded overflow-auto max-h-40 font-mono">
              {JSON.stringify(detResult, null, 2)}
            </pre>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <label className="block text-[10px] text-gray-600">
            슬라이드 조각
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-[10px]"
              onChange={(e) => setTargetFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <label className="block text-[10px] text-gray-600">
            배경 이미지
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-[10px]"
              onChange={(e) => setBackgroundFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {mode === "slide-match" && (
            <label className="flex items-center gap-2 text-[10px] text-gray-600">
              <input
                type="checkbox"
                checked={simpleTarget}
                onChange={(e) => setSimpleTarget(e.target.checked)}
              />
              simple_target (단순 슬라이드)
            </label>
          )}
          <button
            type="button"
            disabled={loading}
            onClick={() => void runSlide()}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs bg-gray-800 text-white rounded hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Puzzle className="w-3.5 h-3.5" />}
            {mode === "slide-match" ? "슬라이드 매칭" : "슬라이드 비교"}
          </button>
          {slideResult && (
            <pre className="text-[10px] bg-gray-50 p-2 rounded overflow-auto max-h-40 font-mono">
              {JSON.stringify(slideResult, null, 2)}
            </pre>
          )}
        </div>
      )}

      {error && <p className="text-[10px] text-red-600">{error}</p>}
    </div>
  );
}
