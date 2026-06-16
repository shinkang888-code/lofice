"use client";

import { useCallback, useState } from "react";
import { Copy, Loader2, Trash2 } from "lucide-react";
import {
  computeFileHashes,
  exportHashesCsv,
  type FileHashResult,
  type HashAlgorithm,
} from "@/lib/officeTool/hash-checker";
import { OTP_NAV } from "@/lib/officeTool/strings-ko";

const ALGOS: HashAlgorithm[] = ["SHA-256", "SHA-1", "SHA-384", "SHA-512"];

export default function HashCheckerPanel() {
  const [results, setResults] = useState<FileHashResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAlgos, setSelectedAlgos] = useState<HashAlgorithm[]>(["SHA-256"]);

  const toggleAlgo = (a: HashAlgorithm) => {
    setSelectedAlgos((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const onFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length || selectedAlgos.length === 0) return;
      setLoading(true);
      try {
        const list: FileHashResult[] = [];
        for (const file of Array.from(files)) {
          list.push(await computeFileHashes(file, selectedAlgos));
        }
        setResults(list);
      } finally {
        setLoading(false);
      }
    },
    [selectedAlgos],
  );

  const copyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash);
  };

  const exportCsv = () => {
    const blob = new Blob([exportHashesCsv(results)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lofice-hashes.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-800">{OTP_NAV.hashChecker}</h2>

      <div className="flex flex-wrap gap-2">
        {ALGOS.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => toggleAlgo(a)}
            className={`px-2 py-1 text-[10px] rounded border ${
              selectedAlgos.includes(a) ? "bg-[#2b579a] text-white border-[#2b579a]" : "bg-white border-gray-200"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      <input
        type="file"
        multiple
        className="text-xs w-full"
        onChange={(e) => void onFiles(e.target.files)}
      />

      {loading && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" /> 계산 중…
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className="flex gap-2">
            <button type="button" onClick={exportCsv} className="text-xs px-2 py-1 border rounded">
              CSV 내보내기
            </button>
            <button type="button" onClick={() => setResults([])} className="text-xs px-2 py-1 border rounded flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> 목록 지우기
            </button>
          </div>
          <ul className="space-y-2 max-h-96 overflow-auto">
            {results.map((r) => (
              <li key={r.fileName} className="p-2 bg-gray-50 rounded-lg text-[10px] font-mono">
                <p className="font-sans font-medium text-gray-800 mb-1">{r.fileName}</p>
                {Object.entries(r.hashes).map(([algo, hash]) => (
                  <div key={algo} className="flex items-center gap-1 break-all">
                    <span className="text-gray-500 w-16 shrink-0">{algo}</span>
                    <span className="flex-1">{hash}</span>
                    <button type="button" onClick={() => void copyHash(hash!)} className="shrink-0 p-1">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
