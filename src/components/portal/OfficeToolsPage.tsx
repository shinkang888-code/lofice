"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { ExternalLink, Search, Send, Sparkles } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import LofficeToolSection from "@/components/home/LofficeToolSection";
import { useToolLabeler } from "@/lib/lofficeUi/useLocalizedTool";
import {
  ALL_LOFFICE_TOOLS,
  filterTools,
} from "@/lib/lofficeUi/tools";
import "./office-tools.css";

const AI_STUDIO_URL =
  process.env.NEXT_PUBLIC_LOBOOK_AI_STUDIO_URL?.replace(/\/$/, "") ||
  "https://book-mu-ochre.vercel.app/ai-studio/workspace";

export default function OfficeToolsPage() {
  const [search, setSearch] = useState("");
  const [prompt, setPrompt] = useState("");
  const labelTool = useToolLabeler();

  const filtered = useMemo(
    () => filterTools(search, ALL_LOFFICE_TOOLS, labelTool),
    [search, labelTool],
  );

  const displayTools = useMemo(() => {
    if (search.trim()) return filtered;
    return ALL_LOFFICE_TOOLS;
  }, [search, filtered]);

  const openAiStudio = useCallback(() => {
    const q = prompt.trim();
    const url = q ? `${AI_STUDIO_URL}?prompt=${encodeURIComponent(q)}` : AI_STUDIO_URL;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [prompt]);

  return (
    <PortalShell active="tools">
      <main className="portal-page-main office-tools">
        <div className="office-tools-hero portal-card">
          <div className="office-tools-chat">
            <label htmlFor="office-tools-prompt" className="sr-only">
              AI Studio 명령
            </label>
            <div className="office-tools-chat-box">
              <Sparkles className="size-4 shrink-0 text-[#1a73e8]" aria-hidden />
              <textarea
                id="office-tools-prompt"
                rows={2}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    openAiStudio();
                  }
                }}
                placeholder="AI에게 지시하세요 — PPT·문서·요약 작업을 Studio에서 생성"
                className="office-tools-chat-input"
              />
              <button type="button" className="office-tools-chat-btn" onClick={openAiStudio}>
                <Send className="size-4" />
                Studio
              </button>
            </div>
          </div>

          <div className="office-tools-links">
            <Link href={AI_STUDIO_URL} target="_blank" rel="noopener noreferrer" className="office-tools-link">
              <ExternalLink className="size-4" />
              AI Studio 워크스페이스 열기
            </Link>
          </div>
        </div>

        <div className="office-tools-search portal-card">
          <div className="office-tools-search-box">
            <Search className="size-4 text-slate-400" />
            <input
              id="office-tools-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="툴 이름, 기능, 해시태그로 검색"
              className="office-tools-search-input"
            />
          </div>
          {search.trim() && filtered.length === 0 && (
            <p className="mt-2 text-sm text-slate-500">검색 결과가 없습니다.</p>
          )}
        </div>

        <div className="office-tools-sections">
          <LofficeToolSection
            id="tools"
            category="doc"
            title=""
            description=""
            tools={displayTools}
            hideHeader
          />
        </div>
      </main>
    </PortalShell>
  );
}
