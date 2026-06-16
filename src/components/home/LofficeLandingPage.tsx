"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ACCEPT_EXTENSIONS } from "@/lib/document-types";
import { openLocalDocument } from "@/lib/lofficeUi/routes";
import LofficeFileOpener from "@/components/home/LofficeFileOpener";
import LofficeToolSection from "@/components/home/LofficeToolSection";
import {
  ALL_LOFFICE_TOOLS,
  LOFFICE_DOC_TOOLS,
  LOFFICE_AI_TOOLS,
  LOFFICE_CONVERT_TOOLS,
  LOFFICE_ANALYZE_TOOLS,
  filterTools,
} from "@/lib/lofficeUi/tools";

const QUICK_CARDS = [
  {
    tag: "보안 AI",
    title: "나만의 보안 AI 채팅",
    icon: "💬",
    desc: "HWP AI·PPT AI로 문서 작업을 브라우저에서 처리합니다.",
    href: "/hwp-ai/",
  },
  {
    tag: "AI 요약",
    title: "PPT AI 생성",
    icon: "✨",
    desc: "GPT·PptxGenJS로 슬라이드를 자동 생성합니다.",
    href: "/ppt-ai/",
  },
  {
    tag: "변환",
    title: "문서 변환 도구",
    icon: "↔️",
    desc: "Office Tool Plus 패턴으로 포맷 간 변환합니다.",
    href: "/convert/",
  },
] as const;

export default function LofficeLandingPage() {
  const router = useRouter();
  const workspaceInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);

  const filtered = useMemo(() => filterTools(search, ALL_LOFFICE_TOOLS), [search]);
  const showAllSections = !search.trim();

  const docTools = showAllSections ? LOFFICE_DOC_TOOLS : filtered.filter((t) => t.category === "doc");
  const aiTools = showAllSections ? LOFFICE_AI_TOOLS : filtered.filter((t) => t.category === "ai");
  const convertTools = showAllSections ? LOFFICE_CONVERT_TOOLS : filtered.filter((t) => t.category === "convert");
  const analyzeTools = showAllSections ? LOFFICE_ANALYZE_TOOLS : filtered.filter((t) => t.category === "analyze");

  const openWorkspacePicker = useCallback(() => workspaceInputRef.current?.click(), []);

  return (
    <div className={`loffice-site min-h-screen bg-background ${dark ? "dark" : ""}`}>
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur safe-top">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/lofice-icon.png" alt="Loffice" width={32} height={32} className="h-8 w-8 rounded-md" priority />
            <span className="text-lg font-bold tracking-tight">
              <span className="text-primary">LOFFICE</span>
              <span className="ml-1.5 text-xs font-medium text-muted-foreground">OFFICE TOOLS</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary" href="#tools">
              📚 로피스 오피스 툴즈
            </Link>
            <Link className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary" href="/files/">
              📁 내 문서
            </Link>
            <Link className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary" href="/settings/">
              ⚙️ 설정
            </Link>
            <div className="ml-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDark((d) => !d)}
                className="rounded-md p-2 text-foreground/70 hover:bg-secondary"
                aria-label="테마 전환"
              >
                {dark ? "☀️" : "🌙"}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-7xl px-6 pb-12 pt-20 text-center">
          <h1 className="text-balance text-4xl font-extrabold leading-tight text-primary sm:text-5xl md:text-6xl">
            무료 온라인 문서 편집 도구
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            설치 없이 브라우저에서 바로 사용할 수 있는 강력한 문서 뷰어·편집 도구
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {["🔒 브라우저 처리", "⚡ 설치 없이 바로 시작", "🎯 대표 작업 바로가기"].map((c) => (
              <span
                key={c}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-card-foreground shadow-sm"
              >
                {c}
              </span>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-2xl text-left">
            <label htmlFor="lo-search" className="mb-2 block text-sm text-muted-foreground">
              어떤 작업을 찾고 계세요?
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-lo-card">
              <span className="text-muted-foreground">🔎</span>
              <input
                id="lo-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="툴 이름, 기능, 해시태그로 검색해 보세요"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            {search.trim() && filtered.length === 0 && (
              <p className="mt-2 text-sm text-muted-foreground">검색 결과가 없습니다.</p>
            )}
          </div>

          <LofficeFileOpener />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-14">
        <h2 className="text-2xl font-bold text-foreground">작업으로 바로 시작</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          툴 이름을 몰라도 됩니다. 지금 하려는 작업을 고르면 가장 알맞은 화면으로 바로 이동합니다.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-lo-card">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workspace</p>
            <h3 className="mt-2 text-xl font-bold text-foreground">편집부터 시작</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              문서를 열고 바로 편집을 이어갑니다. 보기, 주석, 서식, 내보내기까지 한 화면에서.
            </p>
            <button
              type="button"
              onClick={openWorkspacePicker}
              className="mt-5 flex h-44 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/40 text-sm text-muted-foreground transition hover:border-primary/40 hover:bg-secondary/60"
            >
              <span className="text-3xl">☁️</span>
              <p className="mt-2">클릭하거나 드래그하여 업로드</p>
            </button>
            <input
              ref={workspaceInputRef}
              type="file"
              accept={ACCEPT_EXTENSIONS}
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) await openLocalDocument(file, router.push);
                e.target.value = "";
              }}
            />
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openWorkspacePicker}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lo-glow transition hover:opacity-95"
              >
                Loffice 열기
              </button>
              <Link
                href="#tools"
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary"
              >
                편집 도구 보기
              </Link>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-2xl p-6 text-primary-foreground shadow-lo-glow"
            style={{ background: "var(--gradient-brand)" }}
          >
            <div className="absolute -right-6 -top-6 flex h-24 w-24 items-center justify-center rounded-full bg-[color:var(--gold)] text-3xl text-[color:var(--gold-foreground)] shadow-lg">
              ✦
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">LOFFICE NOVA</p>
            <h3 className="mt-2 text-xl font-bold">도구 상자</h3>
            <p className="mt-2 text-sm opacity-90">Office Tool Plus 패턴 해시·설정·변환 도구를 한곳에서.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["변환", "암호화", "마이그레이션"].map((p) => (
                <span key={p} className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                  {p}
                </span>
              ))}
            </div>
            <div className="mt-10 flex items-center justify-between text-sm">
              <span className="opacity-80">lofice</span>
              <Link href="/toolbox/" className="rounded-full bg-white px-4 py-2 font-semibold text-primary hover:bg-white/90">
                도구 상자 열기 ↗
              </Link>
            </div>
          </div>

          <div className="grid grid-rows-3 gap-5">
            {QUICK_CARDS.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="group flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-lo-card transition hover:-translate-y-0.5 hover:border-primary/30"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.tag}</p>
                  <h4 className="mt-1 text-base font-bold text-foreground">{c.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                  <p className="mt-3 text-sm font-semibold text-primary group-hover:underline">바로가기 →</p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-lg">
                  {c.icon}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href="#tools"
            className="rounded-full border border-border bg-card px-5 py-2 text-sm font-medium hover:bg-secondary"
          >
            더 많은 작업 보기
          </Link>
        </div>
      </section>

      <div id="tools" />
      <LofficeToolSection
        id="doc-edit"
        emoji="📝"
        title={showAllSections ? "문서 편집" : "검색 결과 — 문서 편집"}
        description="가장 많이 쓰는 문서 편집 도구를 한 곳에 모았습니다."
        tools={docTools}
      />
      <LofficeToolSection
        id="ai"
        emoji="🤖"
        title={showAllSections ? "AI 도구" : "검색 결과 — AI"}
        description="PPT AI, HWP AI, Office 암호화 등 작업을 가속하는 기능."
        tools={aiTools}
      />
      <LofficeToolSection
        id="convert"
        emoji="🔧"
        title={showAllSections ? "변환 및 생성" : "검색 결과 — 변환"}
        description="포맷 간 변환과 새 문서 생성을 한 번에 처리합니다."
        tools={convertTools}
      />
      <LofficeToolSection
        id="analyze"
        emoji="🔬"
        title={showAllSections ? "문서 분석" : "검색 결과 — 분석"}
        description="메타·도구 상자·마이그레이션까지 문서를 깊이 있게 살펴봅니다."
        tools={analyzeTools}
      />

      <footer className="mt-24 border-t border-border bg-secondary/40 safe-bottom">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <Image src="/lofice-icon.png" alt="Loffice" width={36} height={36} className="h-9 w-9 rounded-md" />
              <div>
                <p className="font-bold text-primary">LOFFICE</p>
                <p className="text-xs text-muted-foreground">설치 없이 브라우저에서 바로 쓰는 올인원 문서 도구</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
              <Link href="/files/" className="hover:text-foreground">
                내 문서
              </Link>
              <Link href="/toolbox/" className="hover:text-foreground">
                도구 상자
              </Link>
              <Link href="/settings/" className="hover:text-foreground">
                설정
              </Link>
            </div>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">© {new Date().getFullYear()} Loffice. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}
