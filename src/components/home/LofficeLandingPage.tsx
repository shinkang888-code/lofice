"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans, Noto_Sans_KR } from "next/font/google";
import {
  BookOpen,
  ChevronDown,
  Globe,
  LayoutGrid,
  Moon,
  Shield,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import LofficeHeroSearch from "@/components/home/LofficeHeroSearch";
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
import { POPULAR_TOOL_NAMES, getToolIconStyle } from "@/lib/lofficeUi/tool-icons";
import {
  LOFFICE_HEADER_NAV,
  LOFFICE_FOOTER_NAV,
  LOFFICE_NOVA,
  LOFFICE_QUICK_CARDS,
  LOFFICE_UPDATES,
  LOFFICE_BLOG_POSTS,
} from "@/lib/lofficeUi/nav";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const sans = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const HERO_CHIPS = [
  { icon: Shield, label: "브라우저 처리" },
  { icon: Zap, label: "설치 없이 바로 시작" },
  { icon: LayoutGrid, label: "대표 작업 바로가기" },
] as const;

const QUICK_ICONS = [Sparkles, BookOpen, LayoutGrid] as const;

export default function LofficeLandingPage() {
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("ko");

  const filtered = useMemo(() => filterTools(search, ALL_LOFFICE_TOOLS), [search]);
  const showAllSections = !search.trim();

  const popularTools = useMemo(
    () => POPULAR_TOOL_NAMES.map((name) => ALL_LOFFICE_TOOLS.find((t) => t.name === name)).filter(Boolean),
    [],
  );

  const docTools = showAllSections ? LOFFICE_DOC_TOOLS : filtered.filter((t) => t.category === "doc");
  const aiTools = showAllSections ? LOFFICE_AI_TOOLS : filtered.filter((t) => t.category === "ai");
  const convertTools = showAllSections ? LOFFICE_CONVERT_TOOLS : filtered.filter((t) => t.category === "convert");
  const analyzeTools = showAllSections ? LOFFICE_ANALYZE_TOOLS : filtered.filter((t) => t.category === "analyze");

  return (
    <div
      className={`loffice-site min-h-screen bg-background ${display.variable} ${sans.variable} font-sans ${dark ? "dark" : ""}`}
    >
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/75 backdrop-blur-xl safe-top">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/lofice-icon.png"
              alt="Loffice"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg shadow-sm"
              priority
            />
            <span className="font-display text-base font-bold tracking-tight sm:text-lg">
              <span className="text-primary">LOFFICE</span>
              <span className="ml-1.5 hidden text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:inline">
                Office Tools
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-0.5 md:flex">
            {LOFFICE_HEADER_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/75 transition hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="ml-2 flex items-center gap-1 border-l border-border pl-3">
              <button
                type="button"
                onClick={() => setDark((d) => !d)}
                className="rounded-lg p-2 text-foreground/70 transition hover:bg-secondary"
                aria-label="테마 전환"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <div className="relative">
                <Globe className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="appearance-none rounded-lg border border-border bg-background py-1.5 pl-7 pr-6 text-xs font-medium"
                  aria-label="언어"
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                </select>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <section className="lo-hero-grid relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-10 text-center sm:px-6 sm:pb-8 sm:pt-12">
          <h1 className="font-display text-balance text-3xl font-extrabold leading-[1.15] tracking-tight text-primary sm:text-4xl md:text-5xl">
            무료 온라인 문서 편집 도구
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
            설치 없이 브라우저에서 바로 사용할 수 있는 강력한 문서 뷰어·편집 도구
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {HERO_CHIPS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-3 py-1 text-xs font-medium text-card-foreground shadow-sm backdrop-blur-sm sm:text-sm"
              >
                <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
                {label}
              </span>
            ))}
          </div>

          <div className="mt-5 sm:mt-6">
            <LofficeHeroSearch
              search={search}
              onSearchChange={setSearch}
              resultCount={filtered.length}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">작업으로 바로 시작</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              지금 하려는 작업을 고르면 가장 알맞은 화면으로 바로 이동합니다.
            </p>
          </div>
          <Link
            href="#tools"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
          >
            더 보기
            <ChevronDown className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
          <LofficeWorkspaceCard />

          <div
            className="relative overflow-hidden rounded-2xl p-5 text-primary-foreground shadow-lo-glow sm:p-6"
            style={{ background: "var(--gradient-brand)" }}
          >
            <div className="absolute -right-4 -top-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gold/90 text-2xl font-bold text-gold-foreground shadow-lg">
              ✦
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-widest opacity-75">Loffice Nova</p>
            <h3 className="mt-1.5 font-display text-lg font-bold sm:text-xl">통합 문서 허브</h3>
            <p className="mt-1.5 text-sm leading-relaxed opacity-90">
              더 많은 문서·업무 기능을 한 곳에서 바로 시작할 수 있습니다.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {LOFFICE_NOVA.tags.map((t) => (
                <Link
                  key={t.label}
                  href={t.href}
                  className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur transition hover:bg-white/25 sm:text-xs"
                >
                  {t.label}
                </Link>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="opacity-75">lofice</span>
              <Link
                href={LOFFICE_NOVA.href}
                className="rounded-full bg-white px-4 py-2 text-xs font-bold text-primary shadow transition hover:bg-white/90 sm:text-sm"
              >
                내 문서 열기 →
              </Link>
            </div>
          </div>

          <div className="grid grid-rows-3 gap-3 sm:gap-4">
            {LOFFICE_QUICK_CARDS.map((c, i) => {
              const Icon = QUICK_ICONS[i] ?? Sparkles;
              return (
                <Link
                  key={c.title}
                  href={c.href}
                  className="group flex items-start justify-between gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-lo-card transition hover:-translate-y-0.5 hover:border-primary/25 sm:p-4"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{c.tag}</p>
                    <h4 className="mt-0.5 text-sm font-bold text-foreground sm:text-base">{c.title}</h4>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground sm:line-clamp-2 sm:text-sm">{c.desc}</p>
                    <p className="mt-2 text-xs font-semibold text-primary group-hover:underline">{c.cta} →</p>
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {showAllSections && popularTools.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-12">
          <div className="mb-4">
            <div className="mb-2 h-1 w-10 rounded-full bg-gradient-to-r from-violet-500/80 to-fuchsia-500/80" />
            <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">가장 인기있는 도구들</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">많은 사용자가 선택한 핵심 기능</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {popularTools.map((t) => {
              if (!t) return null;
              const { Icon, bg, fg } = getToolIconStyle(t);
              return (
                <Link
                  key={t.name}
                  href={t.href}
                  className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-lo-card transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lo-glow"
                >
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}>
                    <Icon className={`h-6 w-6 ${fg}`} strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground">{t.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">{t.desc}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <div id="tools" className="scroll-mt-20" />
      <LofficeToolSection
        id="doc-edit"
        category="doc"
        title={showAllSections ? "문서 편집" : "검색 결과 — 문서 편집"}
        description="가장 많이 쓰는 문서 편집 도구를 한 곳에 모았습니다."
        tools={docTools}
      />
      <LofficeToolSection
        id="ai"
        category="ai"
        title={showAllSections ? "AI 도구" : "검색 결과 — AI"}
        description="요약, 번역, 문서 기반 채팅까지 — 작업을 가속하는 AI 기능."
        tools={aiTools}
        delay={40}
      />
      <LofficeToolSection
        id="convert"
        category="convert"
        title={showAllSections ? "변환 및 생성" : "검색 결과 — 변환"}
        description="포맷 간 변환과 새 문서 생성을 한 번에 처리합니다."
        tools={convertTools}
        delay={80}
      />
      <LofficeToolSection
        id="analyze"
        category="analyze"
        title={showAllSections ? "문서 분석" : "검색 결과 — 분석"}
        description="구조·메타·보안까지 문서를 깊이 있게 살펴봅니다."
        tools={analyzeTools}
        delay={120}
      />

      <section id="updates" className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-14">
        <div className="mb-5">
          <div className="mb-2 h-1 w-10 rounded-full bg-gradient-to-r from-primary to-blue-500/80" />
          <h2 className="font-display text-xl font-bold sm:text-2xl">업데이트 노트</h2>
        </div>
        <ul className="space-y-3">
          {LOFFICE_UPDATES.map((u) => (
            <li key={u.version} className="rounded-2xl border border-border/80 bg-card p-4 shadow-lo-card sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                  {u.version}
                </span>
                <span className="text-xs text-muted-foreground">{u.date}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{u.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="blog" className="mx-auto max-w-7xl px-4 pt-12 pb-6 sm:px-6 sm:pt-14 sm:pb-8">
        <div className="mb-5">
          <div className="mb-2 h-1 w-10 rounded-full bg-gradient-to-r from-amber-500/80 to-orange-500/80" />
          <h2 className="font-display text-xl font-bold sm:text-2xl">블로그</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">lofice 기능 가이드와 활용 팁</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {LOFFICE_BLOG_POSTS.map((post) => (
            <Link
              key={post.title}
              href={post.href}
              className="group rounded-2xl border border-border/80 bg-card p-5 shadow-lo-card transition hover:border-primary/25 hover:shadow-lo-glow"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{post.tag}</span>
              <h3 className="mt-2 font-display text-base font-semibold text-foreground group-hover:text-primary">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-primary group-hover:underline">자세히 보기 →</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-10 border-t border-border bg-secondary/30 safe-bottom sm:mt-14">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <Image src="/lofice-icon.png" alt="Loffice" width={36} height={36} className="h-9 w-9 rounded-lg" />
              <div>
                <p className="font-display font-bold text-primary">LOFFICE</p>
                <p className="text-xs text-muted-foreground">설치 없이 브라우저에서 바로 쓰는 올인원 문서 도구</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground sm:gap-5">
              {LOFFICE_FOOTER_NAV.map((item) => (
                <Link key={item.href + item.label} href={item.href} className="transition hover:text-foreground">
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
