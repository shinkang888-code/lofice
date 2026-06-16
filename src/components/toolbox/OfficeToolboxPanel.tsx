"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Archive,
  Bot,
  FileStack,
  Hash,
  Lock,
  Presentation,
  RefreshCw,
  ScanLine,
  Trash2,
  Wrench,
  ArrowRightLeft,
} from "lucide-react";
import { OTP_NAV, OTP_TOOLBOX } from "@/lib/officeTool/strings-ko";
import { resetPreferences } from "@/lib/officeTool/preferences";
import { clearAllFilesLocal, getStorageStats } from "@/lib/storage/local";

const QUICK_LINKS = [
  { href: "/migrate/", icon: ArrowRightLeft, label: "Office→lofice" },
  { href: "/convert/", icon: RefreshCw, label: OTP_NAV.convert },
  { href: "/office-crypto/", icon: Lock, label: "Office 암호" },
  { href: "/toolbox/?tab=hash", icon: Hash, label: OTP_NAV.hashChecker },
  { href: "/archive/", icon: Archive, label: "7-Zip" },
  { href: "/pdf-editor/", icon: FileStack, label: "PDF 편집" },
  { href: "/ppt-ai/", icon: Presentation, label: "PPT AI" },
  { href: "/hwp-ai/", icon: Bot, label: "한글 AI" },
  { href: "/viewer/?tab=ocr", icon: ScanLine, label: "OCR" },
];

export default function OfficeToolboxPanel() {
  const [stats, setStats] = useState({ fileCount: 0, totalBytes: 0 });
  const [message, setMessage] = useState<string | null>(null);

  const refreshStats = useCallback(async () => {
    setStats(await getStorageStats());
  }, []);

  useEffect(() => {
    void refreshStats();
  }, [refreshStats]);

  const runResetPrefs = () => {
    if (!confirm("환경설정을 초기화할까요?")) return;
    resetPreferences();
    setMessage("환경설정을 재설정했습니다.");
  };

  const runClearCache = async () => {
    if (!confirm("저장된 모든 문서를 삭제할까요? 이 작업은 되돌릴 수 없습니다.")) return;
    const n = await clearAllFilesLocal();
    await refreshStats();
    setMessage(`${n}개 문서를 삭제했습니다.`);
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-[#2b579a]" />
          {OTP_NAV.toolbox}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {QUICK_LINKS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-gray-100 hover:border-[#2b579a]/30 text-center"
            >
              <Icon className="w-5 h-5 text-[#2b579a]" />
              <span className="text-[10px] text-gray-700">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-medium text-gray-600">{OTP_TOOLBOX.general}</h3>
        <div className="p-4 bg-white rounded-xl border border-gray-100 text-xs text-gray-500">
          로컬 문서 {stats.fileCount}개 · {(stats.totalBytes / (1024 * 1024)).toFixed(2)} MB
        </div>
        <button
          type="button"
          onClick={() => void runClearCache()}
          className="w-full flex items-center gap-2 p-3 bg-white rounded-xl border border-red-100 text-left hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-800">{OTP_TOOLBOX.clearCache}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{OTP_TOOLBOX.clearCacheDesc}</p>
          </div>
        </button>
        <button
          type="button"
          onClick={runResetPrefs}
          className="w-full flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-100 text-left hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4 text-[#2b579a] shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-800">{OTP_TOOLBOX.resetPreferences}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{OTP_TOOLBOX.resetPreferencesDesc}</p>
          </div>
        </button>
      </section>

      {message && <p className="text-xs text-green-700 bg-green-50 p-2 rounded-lg">{message}</p>}
    </div>
  );
}
