"use client";

import { useCallback, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import JSZip from "jszip";
import {
  CONVERT_MATRIX,
  convertDocument,
  detectInputFormat,
  type ConvertJob,
  type ConvertOutputFormat,
} from "@/lib/officeTool/document-convert";
import { OTP_CONVERT } from "@/lib/officeTool/strings-ko";
import { saveFileLocal } from "@/lib/storage/local";

type QueueItem = { file: File; input: NonNullable<ReturnType<typeof detectInputFormat>> };

export default function DocumentConvertPanel() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [output, setOutput] = useState<ConvertOutputFormat>("txt");
  const [jobs, setJobs] = useState<ConvertJob[]>([]);
  const [loading, setLoading] = useState(false);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const items: QueueItem[] = [];
    for (const file of Array.from(files)) {
      const input = detectInputFormat(file.name);
      if (input) items.push({ file, input });
    }
    setQueue((prev) => [...prev, ...items]);
  };

  const availableOutputs = queue.length
    ? [...new Set(queue.flatMap((q) => CONVERT_MATRIX[q.input]))]
    : (["txt", "html", "csv", "md"] as ConvertOutputFormat[]);

  const runConvert = useCallback(async () => {
    if (!queue.length) return;
    setLoading(true);
    const zip = new JSZip();
    const newJobs: ConvertJob[] = [];

    for (const item of queue) {
      const id = `${item.file.name}-${Date.now()}`;
      try {
        const buffer = await item.file.arrayBuffer();
        const { bytes, outName } = await convertDocument(buffer, item.file.name, output);
        zip.file(outName, bytes);
        newJobs.push({
          id,
          fileName: item.file.name,
          input: item.input,
          output,
          status: "done",
          resultBytes: bytes,
          resultName: outName,
        });
        await saveFileLocal(new File([new Uint8Array(bytes)], outName));
      } catch (e) {
        newJobs.push({
          id,
          fileName: item.file.name,
          input: item.input,
          output,
          status: "error",
          error: e instanceof Error ? e.message : "변환 실패",
        });
      }
    }

    setJobs(newJobs);
    if (newJobs.some((j) => j.status === "done")) {
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "lofice-converted.zip";
      a.click();
      URL.revokeObjectURL(url);
    }
    setLoading(false);
  }, [output, queue]);

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-800">{OTP_CONVERT.title}</h2>
      <p className="text-[10px] text-gray-500">
        Office Tool Plus 문서 변환 패턴 · Word/Excel/한글/텍스트를 브라우저에서 변환합니다.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <label className="text-[10px] text-gray-600">
          {OTP_CONVERT.outputFormat}
          <select
            value={output}
            onChange={(e) => setOutput(e.target.value as ConvertOutputFormat)}
            className="mt-1 w-full text-xs border rounded px-2 py-1.5"
          >
            {availableOutputs.map((o) => (
              <option key={o} value={o}>{o.toUpperCase()}</option>
            ))}
          </select>
        </label>
      </div>

      <input type="file" multiple accept=".docx,.xlsx,.csv,.hwp,.hwpx,.txt,.md,.html" className="text-xs w-full" onChange={(e) => addFiles(e.target.files)} />

      <div className="flex gap-2">
        <button
          type="button"
          disabled={loading || !queue.length}
          onClick={() => void runConvert()}
          className="flex-1 py-2 text-sm bg-[#2b579a] text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {OTP_CONVERT.start}
        </button>
        <button type="button" onClick={() => { setQueue([]); setJobs([]); }} className="px-3 py-2 border rounded-lg text-xs flex items-center gap-1">
          <Trash2 className="w-3 h-3" /> {OTP_CONVERT.clearList}
        </button>
      </div>

      {queue.length > 0 && (
        <div>
          <p className="text-[10px] text-gray-500 mb-1">{OTP_CONVERT.fileList} ({queue.length})</p>
          <ul className="text-xs space-y-1 max-h-32 overflow-auto">
            {queue.map((q) => (
              <li key={q.file.name + q.file.size} className="truncate font-mono text-gray-700">{q.file.name}</li>
            ))}
          </ul>
        </div>
      )}

      {jobs.length > 0 && (
        <ul className="text-[10px] space-y-1">
          {jobs.map((j) => (
            <li key={j.id} className={j.status === "error" ? "text-red-600" : "text-green-700"}>
              {j.fileName} → {j.resultName ?? j.error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
