"use client";

import { useState } from "react";
import {
  ArrowLeft, Edit3, Share2, Save, FileText, Home, Eye,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

type RibbonTab = "home" | "view" | "file";

interface Props {
  fileName: string;
  canEdit?: boolean;
  editHref?: string;
  onShare?: () => void;
  onSave?: () => void;
  saving?: boolean;
  children: React.ReactNode;
}

export default function OfficeLayout({
  fileName,
  canEdit,
  editHref,
  onShare,
  onSave,
  saving,
  children,
}: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<RibbonTab>("home");

  return (
    <div className="flex flex-col h-screen bg-[#f3f3f3] select-none">
      {/* 타이틀 바 - 한컴 스타일 */}
      <div className="h-8 bg-[#1a3a6b] flex items-center px-3 text-white text-xs shrink-0 safe-top">
        <span className="font-semibold tracking-wide">lofice</span>
        <span className="mx-2 opacity-40">|</span>
        <span className="truncate opacity-90">{fileName}</span>
      </div>

      {/* 퀵 액세스 + 리본 탭 */}
      <div className="bg-[#2b579a] shrink-0">
        <div className="flex items-center px-2 h-9 gap-1">
          <button onClick={() => router.back()} className="p-1.5 text-white/80 hover:bg-white/10 rounded" title="뒤로">
            <ArrowLeft className="w-4 h-4" />
          </button>
          {(["file", "home", "view"] as RibbonTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1 text-xs font-medium rounded-t transition-colors ${
                tab === t ? "bg-[#f3f3f3] text-[#2b579a]" : "text-white/90 hover:bg-white/10"
              }`}
            >
              {t === "file" ? "파일" : t === "home" ? "홈" : "보기"}
            </button>
          ))}
          <div className="flex-1" />
          {onSave && (
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" /> {saving ? "저장 중" : "저장"}
            </button>
          )}
          {canEdit && editHref && (
            <button
              onClick={() => router.push(editHref)}
              className="flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded"
            >
              <Edit3 className="w-3.5 h-3.5" /> 편집
            </button>
          )}
          {onShare && (
            <button onClick={onShare} className="p-1.5 text-white/80 hover:bg-white/10 rounded">
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 리본 도구 모음 */}
      <div className="bg-[#f3f3f3] border-b border-gray-300 px-3 py-2 shrink-0 min-h-[72px]">
        {tab === "file" && (
          <div className="flex gap-6 text-xs">
            <RibbonGroup label="파일">
              <RibbonBtn icon={FileText} label="새 문서" onClick={() => router.push("/")} />
              <RibbonBtn icon={ArrowLeft} label="목록" onClick={() => router.push("/files/")} />
            </RibbonGroup>
          </div>
        )}
        {tab === "home" && (
          <div className="flex gap-6 text-xs overflow-x-auto">
            <RibbonGroup label="글꼴">
              <RibbonBtn icon={Bold} label="굵게" />
              <RibbonBtn icon={Italic} label="기울임" />
              <RibbonBtn icon={Underline} label="밑줄" />
            </RibbonGroup>
            <RibbonGroup label="단락">
              <RibbonBtn icon={AlignLeft} label="왼쪽" />
              <RibbonBtn icon={AlignCenter} label="가운데" />
              <RibbonBtn icon={AlignRight} label="오른쪽" />
            </RibbonGroup>
            {canEdit && editHref && (
              <RibbonGroup label="편집">
                <RibbonBtn icon={Edit3} label="편집 모드" onClick={() => router.push(editHref)} />
              </RibbonGroup>
            )}
          </div>
        )}
        {tab === "view" && (
          <div className="flex gap-6 text-xs">
            <RibbonGroup label="보기">
              <RibbonBtn icon={Eye} label="읽기 모드" />
              <RibbonBtn icon={Home} label="홈으로" onClick={() => router.push("/")} />
            </RibbonGroup>
          </div>
        )}
      </div>

      {/* 문서 영역 */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}

function RibbonGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col border-r border-gray-300 pr-4 last:border-0">
      <div className="flex gap-1 mb-1">{children}</div>
      <span className="text-[10px] text-gray-500 text-center">{label}</span>
    </div>
  );
}

function RibbonBtn({
  icon: Icon, label, onClick,
}: { icon: React.ComponentType<{ className?: string }>; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 px-2 py-1 hover:bg-gray-200 rounded min-w-[44px]"
    >
      <Icon className="w-5 h-5 text-gray-700" />
      <span className="text-[10px] text-gray-600">{label}</span>
    </button>
  );
}
