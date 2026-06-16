"use client";

import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import {
  exportPreferencesJson,
  importPreferencesJson,
} from "@/lib/officeTool/preferences";
import { OTP_TOOLBOX } from "@/lib/officeTool/strings-ko";

export default function SettingsIoPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const exportJson = () => {
    const blob = new Blob([exportPreferencesJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lofice-settings.json";
    a.click();
    URL.revokeObjectURL(url);
    setMessage("설정을 내보냈습니다.");
  };

  const onImport = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importPreferencesJson(String(reader.result));
        setMessage("설정을 가져왔습니다. 페이지를 새로고침하세요.");
      } catch {
        setMessage("설정 파일 형식이 올바르지 않습니다.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold text-gray-800">설정 백업</h2>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={exportJson}
          className="flex-1 flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-gray-100 text-sm"
        >
          <Download className="w-4 h-4" /> {OTP_TOOLBOX.exportSettings}
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-gray-100 text-sm"
        >
          <Upload className="w-4 h-4" /> {OTP_TOOLBOX.importSettings}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => {
          onImport(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {message && <p className="text-xs text-gray-600">{message}</p>}
    </section>
  );
}
