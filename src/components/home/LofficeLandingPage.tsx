"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import LofficeFileOpener from "@/components/home/LofficeFileOpener";
import LofficeToolSection from "@/components/home/LofficeToolSection";
import LofficeWorkspaceCard from "@/components/home/LofficeWorkspaceCard";
import {
  ALL_LOFFICE_TOOLS,
  LOFFICE_DOC_TOOLS,
  LOFFICE_AI_TOOLS,
  LOFFICE_CONVERT_TOOLS,
  LOFFICE_ANALYZE_TOOLS,
  filterTools,
} from "@/lib/lofficeUi/tools";
import {
  LOFFICE_HEADER_NAV,
  LOFFICE_FOOTER_NAV,
  LOFFICE_NOVA,
  LOFFICE_QUICK_CARDS,
  LOFFICE_UPDATES,
  LOFFICE_BLOG_POSTS,
} from "@/lib/lofficeUi/nav";

export default function LofficeLandingPage() {
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("ko");

  const filtered = useMemo(() => filterTools(search, ALL_LOFFICE_TOOLS), [search]);
  const showAllSections = !search.trim();

  const docTools = showAllSections ? LOFFICE_DOC_TOOLS : filtered.filter((t) => t.category === "doc");
  const aiTools = showAllSections ? LOFFICE_AI_TOOLS : filtered.filter((t) => t.category === "ai");
  const convertTools = showAllSections ? LOFFICE_CONVERT_TOOLS : filtered.filter((t) => t.category === "convert");
  const analyzeTools = showAllSections ? LOFFICE_ANALYZE_TOOLS : filtered.filter((t) => t.category === "analyze");

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
            {LOFFICE_HEADER_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
            <div className="ml-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDark((d) => !d)}
                className="rounded-md p-2 text-foreground/70 hover:bg-secondary"
                aria-label="테마 전환"
              >
                {dark ? "☀️" : "🌙"}
              </button>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                aria-label="언어"
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
              </select>
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
          <LofficeWorkspaceCard />

          <div
            className="relative overflow-hidden rounded-2xl p-6 text-primary-foreground shadow-lo-glow"
            style={{ background: "var(--gradient-brand)" }}
          >
            <div className="absolute -right-6 -top-6 flex h-24 w-24 items-center justify-center rounded-full bg-[color:var(--gold)] text-3xl text-[color:var(--gold-foreground)] shadow-lg">
              ✦
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">LOFFICE NOVA</p>
            <h3 className="mt-2 text-xl font-bold">LOFFICE NOVA</h3>
            <p className="mt-2 text-sm opacity-90">더 많은 문서·업무 기능을 새 창에서 바로 시작할 수 있습니다.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {LOFFICE_NOVA.tags.map((t) => (
                <Link
                  key={t.label}
                  href={t.href}
                  className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur hover:bg-white/25"
                >
                  {t.label}
                </Link>
              ))}
            </div>
            <div className="mt-10 flex items-center justify-between text-sm">
              <span className="opacity-80">lofice</span>
              <Link
                href={LOFFICE_NOVA.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white px-4 py-2 font-semibold text-primary hover:bg-white/90"
              >
                새 창에서 열기 ↗
              </Link>
            </div>
          </div>

          <div className="grid grid-rows-3 gap-5">
            {LOFFICE_QUICK_CARDS.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="group flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-lo-card transition hover:-translate-y-0.5 hover:border-primary/30"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.tag}</p>
                  <h4 className="mt-1 text-base font-bold text-foreground">{c.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                  <p className="mt-3 text-sm font-semibold text-primary group-hover:underline">{c.cta} →</p>
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
        description="요약, 번역, 문서 기반 채팅까지 — 작업을 가속하는 AI 기능."
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
        description="구조·메타·보안까지 문서를 깊이 있게 살펴봅니다."
        tools={analyzeTools}
      />

      <section id="updates" className="mx-auto max-w-7xl px-6 pt-16">
        <h2 className="text-2xl font-bold text-foreground">
          <span className="mr-2">📋</span>업데이트 노트
        </h2>
        <ul className="mt-6 space-y-4">
          {LOFFICE_UPDATES.map((u) => (
            <li key={u.version} className="rounded-xl border border-border bg-card p-4 shadow-lo-card">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                  {u.version}
                </span>
                <span className="text-xs text-muted-foreground">{u.date}</span>
              </div>
              <p className="mt-2 text-sm text-foreground">{u.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="blog" className="mx-auto max-w-7xl px-6 pt-16 pb-8">
        <h2 className="text-2xl font-bold text-foreground">
          <span className="mr-2">✍️</span>블로그
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">lofice 기능 가이드와 활용 팁</p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {LOFFICE_BLOG_POSTS.map((post) => (
            <Link
              key={post.title}
              href={post.href}
              className="group rounded-xl border border-border bg-card p-5 shadow-lo-card transition hover:border-primary/30"
            >
              <span className="text-xs font-semibold text-muted-foreground">{post.tag}</span>
              <h3 className="mt-2 font-semibold text-foreground group-hover:text-primary">{post.title}</h3>
              <p className="mt-2 text-sm text-primary group-hover:underline">자세히 보기 →</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-border bg-secondary/40 safe-bottom">
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
              {LOFFICE_FOOTER_NAV.map((item) => (
                <Link key={item.href + item.label} href={item.href} className="hover:text-foreground">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">© {new Date().getFullYear()} Loffice. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}
