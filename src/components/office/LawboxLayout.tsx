"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft, Edit3, Share2, Save, FileText, Home, Eye,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  ImageIcon, Table, FileCode,
} from "lucide-react";
import { useRouter } from "next/navigation";

type RibbonTab = "file" | "home" | "insert" | "view";

interface Props {
  fileName: string;
  canEdit?: boolean;
  editHref?: string;
  onShare?: () => void;
  onSave?: () => void;
  saving?: boolean;
  children: React.ReactNode;
}

export default function LawboxLayout({
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

  const tabs: { id: RibbonTab; label: string }[] = [
    { id: "file", label: "파일" },
    { id: "home", label: "홈" },
    { id: "insert", label: "삽입" },
    { id: "view", label: "보기" },
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-[#f3f3f3] select-none">
      {/* 타이틀 바 — LAWBOX 브랜드 */}
      <div className="h-9 bg-lawbox-navy flex items-center px-3 text-white text-xs shrink-0 safe-top border-b-2 border-lawbox-gold">
        <Image src="/lawbox-icon.png" alt="LAWBOX" width={20} height={20} className="w-5 h-5 rounded-sm mr-2" />
        <span className="font-bold tracking-wider text-lawbox-gold">LAWBOX</span>
        <span className="mx-2 opacity-40">|</span>
        <span className="truncate opacity-90 flex-1">{fileName}</span>
      </div>

      {/* 리본 탭 — 횡스크롤 */}
      <div className="bg-[#1a4a7a] shrink-0">
        <div className="flex items-center px-2 h-9 gap-1 overflow-x-auto scrollbar-thin">
          <button onClick={() => router.back()} className="p-1.5 text-white/80 hover:bg-white/10 rounded shrink-0" title="뒤로">
            <ArrowLeft className="w-4 h-4" />
          </button>
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-1 text-xs font-medium rounded-t transition-colors shrink-0 ${
                tab === id ? "bg-[#f3f3f3] text-lawbox-navy" : "text-white/90 hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
          <div className="flex-1 min-w-4" />
          {onSave && (
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-1 px-3 py-1 bg-lawbox-gold/90 hover:bg-lawbox-gold text-lawbox-navy text-xs font-semibold rounded shrink-0 disabled:opacity-50"
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
          {onShare && (
            <button onClick={onShare} className="p-1.5 text-white/80 hover:bg-white/10 rounded shrink-0">
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 리본 도구 — 횡스크롤 */}
      <div className="bg-[#f3f3f3] border-b border-gray-300 px-3 py-2 shrink-0 min-h-[72px] overflow-x-auto">
        {tab === "file" && (
          <div className="flex gap-6 text-xs min-w-max">
            <RibbonGroup label="파일">
              <RibbonBtn icon={FileText} label="새 문서" onClick={() => router.push("/")} />
              <RibbonBtn icon={ArrowLeft} label="목록" onClick={() => router.push("/files/")} />
            </RibbonGroup>
          </div>
        )}
        {tab === "home" && (
          <div className="flex gap-6 text-xs min-w-max">
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
        {tab === "insert" && (
          <div className="flex gap-6 text-xs min-w-max">
            <RibbonGroup label="삽입">
              <RibbonBtn icon={ImageIcon} label="이미지" />
              <RibbonBtn icon={Table} label="표" />
              <RibbonBtn icon={FileCode} label="코드" />
            </RibbonGroup>
          </div>
        )}
        {tab === "view" && (
          <div className="flex gap-6 text-xs min-w-max">
            <RibbonGroup label="보기">
              <RibbonBtn icon={Eye} label="읽기 모드" />
              <RibbonBtn icon={Home} label="홈으로" onClick={() => router.push("/")} />
            </RibbonGroup>
          </div>
        )}
      </div>

      <main className="flex-1 overflow-hidden min-h-0">{children}</main>
    </div>
  );
}

function RibbonGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col border-r border-gray-300 pr-4 last:border-0 shrink-0">
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
      <span className="text-[10px] text-gray-600 whitespace-nowrap">{label}</span>
    </button>
  );
}
