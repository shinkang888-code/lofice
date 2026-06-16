"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Archive,
  CheckCircle2,
  Download,
  FolderArchive,
  Loader2,
  PackageOpen,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  archiveCreate,
  archiveExtract,
  archiveList,
  archivePackExtractedZip,
  archiveTest,
} from "@/lib/archive/archive-tools";
import type { ArchiveEntry } from "@/lib/archive/archive-types";
import { FORMAT_LABEL, MAX_ARCHIVE_BYTES, detectArchiveFormat } from "@/lib/archive/archive-types";
import { preloadSevenZip } from "@/lib/archive/sevenZip-engine";

interface Props {
  buffer: ArrayBuffer;
  fileName: string;
  onClose?: () => void;
  className?: string;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

/** 7-Zip 아카이브 브라우저 — 목록·추출·테스트·압축 */
export default function ArchivePanel({ buffer, fileName, onClose, className = "" }: Props) {
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<string>("");
  const [testOk, setTestOk] = useState<boolean | null>(null);
  const [compressFiles, setCompressFiles] = useState<File[]>([]);

  const fmt = useMemo(() => detectArchiveFormat(fileName), [fileName]);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    setTestOk(null);
    try {
      await preloadSevenZip();
      const res = await archiveList(buffer, fileName);
      setEntries(res.entries.filter((e) => e.path && !e.isDir));
      setMethod(res.method);
      setSelected(new Set());
    } catch (e) {
      setError(e instanceof Error ? e.message : "목록 읽기 실패");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [buffer, fileName]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  const toggle = (path: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const runTest = async () => {
    setBusy("test");
    setError(null);
    try {
      await archiveTest(buffer, fileName);
      setTestOk(true);
    } catch (e) {
      setTestOk(false);
      setError(e instanceof Error ? e.message : "테스트 실패");
    } finally {
      setBusy("");
    }
  };

  const runExtract = async (all: boolean) => {
    setBusy("extract");
    setError(null);
    try {
      const paths = all ? undefined : [...selected];
      if (!all && (!paths || paths.length === 0)) {
        setError("추출할 파일을 선택하세요.");
        return;
      }
      const res = await archiveExtract(buffer, fileName, paths);
      const base = fileName.replace(/\.[^.]+$/, "");
      await archivePackExtractedZip(res.files, `${base}_extracted.zip`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "추출 실패");
    } finally {
      setBusy("");
    }
  };

  const runCompress = async () => {
    if (compressFiles.length === 0) {
      setError("압축할 파일을 선택하세요.");
      return;
    }
    setBusy("compress");
    setError(null);
    try {
      await preloadSevenZip();
      const items: { path: string; data: Uint8Array }[] = [];
      for (const f of compressFiles) {
        items.push({ path: f.name, data: new Uint8Array(await f.arrayBuffer()) });
      }
      const outName = `archive_${Date.now()}.7z`;
      const data = await archiveCreate(items, outName, { format: "7z", level: 5 });
      const blob = new Blob([data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = outName;
      a.click();
      URL.revokeObjectURL(url);
      setCompressFiles([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "압축 실패");
    } finally {
      setBusy("");
    }
  };

  const tooLarge = buffer.byteLength > MAX_ARCHIVE_BYTES;

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 shrink-0 bg-[#f3f3f3]">
        <div className="flex items-center gap-2 min-w-0">
          <Archive className="w-4 h-4 text-[#2b579a] shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{fileName}</p>
            <p className="text-[10px] text-gray-500">
              {FORMAT_LABEL[fmt]} · {formatBytes(buffer.byteLength)}
              {method ? ` · ${method}` : ""}
            </p>
          </div>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="p-1 rounded hover:bg-gray-200 shrink-0">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {tooLarge && (
        <p className="text-xs text-amber-700 px-3 py-2 bg-amber-50 border-b">
          {MAX_ARCHIVE_BYTES / (1024 * 1024)}MB 초과 — 브라우저 WASM 처리에 제한이 있을 수 있습니다.
        </p>
      )}

      <div className="p-2 border-b border-gray-100 flex flex-wrap gap-1 shrink-0">
        <button
          type="button"
          disabled={!!busy || loading}
          onClick={() => void runExtract(true)}
          className="flex items-center gap-1 px-2 py-1.5 text-[10px] bg-[#2b579a] text-white rounded hover:bg-[#1e3f6f] disabled:opacity-50"
        >
          {busy === "extract" ? <Loader2 className="w-3 h-3 animate-spin" /> : <PackageOpen className="w-3 h-3" />}
          전체 풀기
        </button>
        <button
          type="button"
          disabled={!!busy || loading || selected.size === 0}
          onClick={() => void runExtract(false)}
          className="flex items-center gap-1 px-2 py-1.5 text-[10px] border rounded hover:bg-gray-50 disabled:opacity-50"
        >
          <Download className="w-3 h-3" /> 선택 추출 ({selected.size})
        </button>
        <button
          type="button"
          disabled={!!busy || loading}
          onClick={() => void runTest()}
          className="flex items-center gap-1 px-2 py-1.5 text-[10px] border rounded hover:bg-gray-50 disabled:opacity-50"
        >
          {busy === "test" ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : testOk ? (
            <CheckCircle2 className="w-3 h-3 text-green-600" />
          ) : (
            <ShieldCheck className="w-3 h-3" />
          )}
          테스트 (t)
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => void loadList()}
          className="px-2 py-1.5 text-[10px] border rounded hover:bg-gray-50"
        >
          새로고침
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-gray-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> 7-Zip WASM 로딩…
          </div>
        ) : entries.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-12">파일 목록이 비어 있거나 읽을 수 없습니다.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {entries.map((e) => (
              <li key={e.path}>
                <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={selected.has(e.path)}
                    onChange={() => toggle(e.path)}
                    className="rounded"
                  />
                  <span className="flex-1 truncate font-mono text-gray-800" title={e.path}>
                    {e.path}
                  </span>
                  <span className="text-gray-400 shrink-0">{formatBytes(e.size)}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-3 border-t border-gray-100 shrink-0 space-y-2 bg-gray-50">
        <div className="flex items-center gap-2 text-[10px] font-medium text-gray-700">
          <FolderArchive className="w-3.5 h-3.5" /> 새 압축 (a)
        </div>
        <input
          type="file"
          multiple
          className="text-[10px] w-full"
          onChange={(ev) => setCompressFiles(Array.from(ev.target.files ?? []))}
        />
        <button
          type="button"
          disabled={!!busy || compressFiles.length === 0}
          onClick={() => void runCompress()}
          className="w-full py-1.5 text-xs bg-gray-800 text-white rounded disabled:opacity-50"
        >
          {busy === "compress" ? "압축 중…" : `.7z로 압축 (${compressFiles.length}개)`}
        </button>
        {error && <p className="text-[10px] text-red-600">{error}</p>}
      </div>
    </div>
  );
}
