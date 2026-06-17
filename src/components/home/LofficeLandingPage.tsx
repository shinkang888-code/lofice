"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans, Noto_Sans_KR } from "next/font/google";
import {
  BookOpen,
  ChevronDown,
  LayoutGrid,
  Moon,
  Shield,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import LanguagePicker from "@/components/i18n/LanguagePicker";
import LofficeHeroSearch from "@/components/home/LofficeHeroSearch";
import LofficeToolSection from "@/components/home/LofficeToolSection";
import LofficeWorkspaceCard from "@/components/home/LofficeWorkspaceCard";
import { useI18n } from "@/i18n/I18nProvider";
import {
  ALL_LOFFICE_TOOLS,
  LOFFICE_DOC_TOOLS,
  LOFFICE_AI_TOOLS,
  LOFFICE_CONVERT_TOOLS,
  LOFFICE_ANALYZE_TOOLS,
  filterTools,
} from "@/lib/lofficeUi/tools";
import { POPULAR_TOOL_NAMES, getToolIconStyle } from "@/lib/lofficeUi/tool-icons";
import { useToolLabeler } from "@/lib/lofficeUi/useLocalizedTool";
import { LOFFICE_NOVA, LOFFICE_QUICK_CARDS, LOFFICE_BLOG_POSTS } from "@/lib/lofficeUi/nav";

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

const QUICK_ICONS = [Sparkles, BookOpen, LayoutGrid] as const;

const QUICK_KEYS = [
  ["quick.secureAiTag", "quick.secureAiTitle", "quick.secureAiDesc", "quick.secureAiCta"],
  ["quick.summaryTag", "quick.summaryTitle", "quick.summaryDesc", "quick.summaryCta"],
  ["quick.convertTag", "quick.convertTitle", "quick.convertDesc", "quick.convertCta"],
] as const;

const BLOG_KEYS = [
  ["blog.tagGuide", "blog.post1"],
  ["blog.tagAi", "blog.post2"],
  ["blog.tagTools", "blog.post3"],
  ["blog.tagPdf", "blog.post4"],
] as const;

const UPDATE_KEYS = ["updates.v217", "updates.v216", "updates.v212", "updates.v211", "updates.v210", "updates.v207"] as const;
const UPDATE_VERSIONS = ["v2.17.0", "v2.16.0", "v2.12.0", "v2.11.0", "v2.10.0", "v2.7.0"] as const;
const UPDATE_DATES = ["2026-06", "2026-06", "2026-06", "2026-06", "2026-06", "2026-06"] as const;

export default function LofficeLandingPage() {
  const { t, ready } = useI18n();
  const labelTool = useToolLabeler();
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);

  const filtered = useMemo(
    () => filterTools(search, ALL_LOFFICE_TOOLS, labelTool),
    [search, labelTool],
  );
  const showAllSections = !search.trim();

  const popularTools = useMemo(
    () => POPULAR_TOOL_NAMES.map((id) => ALL_LOFFICE_TOOLS.find((tool) => tool.id === id)).filter(Boolean),
    [],
  );

  const docTools = showAllSections ? LOFFICE_DOC_TOOLS : filtered.filter((tool) => tool.category === "doc");
  const aiTools = showAllSections ? LOFFICE_AI_TOOLS : filtered.filter((tool) => tool.category === "ai");
  const convertTools = showAllSections ? LOFFICE_CONVERT_TOOLS : filtered.filter((tool) => tool.category === "convert");
  const analyzeTools = showAllSections ? LOFFICE_ANALYZE_TOOLS : filtered.filter((tool) => tool.category === "analyze");

  const heroChips = [
    { icon: Shield, label: t("hero.chipBrowser") },
    { icon: Zap, label: t("hero.chipInstant") },
    { icon: LayoutGrid, label: t("hero.chipShortcut") },
  ];

  const novaTags = [
    { label: t("nova.tagAiChat"), href: "/hwp-ai/" },
    { label: t("nova.tagDocWork"), href: "/files/" },
    { label: t("nova.tagTranslate"), href: "/convert/" },
  ];

  const headerNav = [
    { label: t("nav.tools"), href: "#tools" },
    { label: t("nav.updates"), href: "#updates" },
    { label: t("nav.blog"), href: "#blog" },
  ];

  const footerNav = [
    { label: t("nav.updatesFooter"), href: "#updates" },
    { label: t("nav.blog"), href: "#blog" },
    { label: t("nav.myDocs"), href: "/files/" },
    { label: t("nav.settings"), href: "/settings/" },
  ];

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

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
              <span className="text-primary">{t("common.brand")}</span>
              <span className="ml-1.5 hidden text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:inline">
                {t("common.brandSubtitle")}
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-0.5 md:flex">
            {headerNav.map((item) => (
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
                aria-label={t("common.themeToggle")}
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <LanguagePicker compact />
            </div>
          </nav>
          <div className="flex items-center gap-1 md:hidden">
            <LanguagePicker compact />
          </div>
        </div>
      </header>

      <section className="lo-hero-grid relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-10 text-center sm:px-6 sm:pb-8 sm:pt-12">
          <h1 className="font-display text-balance text-3xl font-extrabold leading-[1.15] tracking-tight text-primary sm:text-4xl md:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
            {t("hero.subtitle")}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {heroChips.map(({ icon: Icon, label }) => (
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
            <LofficeHeroSearch search={search} onSearchChange={setSearch} resultCount={filtered.length} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">{t("start.title")}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{t("start.desc")}</p>
          </div>
          <Link
            href="#tools"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
          >
            {t("start.more")}
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
            <p className="text-[10px] font-semibold uppercase tracking-widest opacity-75">{t("nova.label")}</p>
            <h3 className="mt-1.5 font-display text-lg font-bold sm:text-xl">{t("nova.title")}</h3>
            <p className="mt-1.5 text-sm leading-relaxed opacity-90">{t("nova.desc")}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {novaTags.map((tag) => (
                <Link
                  key={tag.href}
                  href={tag.href}
                  className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur transition hover:bg-white/25 sm:text-xs"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="opacity-75">lofice</span>
              <Link
                href={LOFFICE_NOVA.href}
                className="rounded-full bg-white px-4 py-2 text-xs font-bold text-primary shadow transition hover:bg-white/90 sm:text-sm"
              >
                {t("nova.openDocs")}
              </Link>
            </div>
          </div>

          <div className="grid grid-rows-3 gap-3 sm:gap-4">
            {LOFFICE_QUICK_CARDS.map((c, i) => {
              const Icon = QUICK_ICONS[i] ?? Sparkles;
              const keys = QUICK_KEYS[i]!;
              return (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group flex items-start justify-between gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-lo-card transition hover:-translate-y-0.5 hover:border-primary/25 sm:p-4"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t(keys[0])}</p>
                    <h4 className="mt-0.5 text-sm font-bold text-foreground sm:text-base">{t(keys[1])}</h4>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground sm:line-clamp-2 sm:text-sm">{t(keys[2])}</p>
                    <p className="mt-2 text-xs font-semibold text-primary group-hover:underline">{t(keys[3])} →</p>
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
            <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">{t("popular.title")}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{t("popular.desc")}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {popularTools.map((tool) => {
              if (!tool) return null;
              const { Icon, bg, fg } = getToolIconStyle(tool);
              const label = labelTool(tool);
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-lo-card transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lo-glow"
                >
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}>
                    <Icon className={`h-6 w-6 ${fg}`} strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground">{label.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">{label.desc}</p>
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
        title={showAllSections ? t("sections.docTitle") : t("sections.docSearch")}
        description={t("sections.docDesc")}
        tools={docTools}
      />
      <LofficeToolSection
        id="ai"
        category="ai"
        title={showAllSections ? t("sections.aiTitle") : t("sections.aiSearch")}
        description={t("sections.aiDesc")}
        tools={aiTools}
        delay={40}
      />
      <LofficeToolSection
        id="convert"
        category="convert"
        title={showAllSections ? t("sections.convertTitle") : t("sections.convertSearch")}
        description={t("sections.convertDesc")}
        tools={convertTools}
        delay={80}
      />
      <LofficeToolSection
        id="analyze"
        category="analyze"
        title={showAllSections ? t("sections.analyzeTitle") : t("sections.analyzeSearch")}
        description={t("sections.analyzeDesc")}
        tools={analyzeTools}
        delay={120}
      />

      <section id="updates" className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-14">
        <div className="mb-5">
          <div className="mb-2 h-1 w-10 rounded-full bg-gradient-to-r from-primary to-blue-500/80" />
          <h2 className="font-display text-xl font-bold sm:text-2xl">{t("updates.title")}</h2>
        </div>
        <ul className="space-y-3">
          {UPDATE_KEYS.map((key, i) => (
            <li key={key} className="rounded-2xl border border-border/80 bg-card p-4 shadow-lo-card sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                  {UPDATE_VERSIONS[i]}
                </span>
                <span className="text-xs text-muted-foreground">{UPDATE_DATES[i]}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{t(key)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="blog" className="mx-auto max-w-7xl px-4 pt-12 pb-6 sm:px-6 sm:pt-14 sm:pb-8">
        <div className="mb-5">
          <div className="mb-2 h-1 w-10 rounded-full bg-gradient-to-r from-amber-500/80 to-orange-500/80" />
          <h2 className="font-display text-xl font-bold sm:text-2xl">{t("blog.title")}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{t("blog.desc")}</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {LOFFICE_BLOG_POSTS.map((post, i) => {
            const keys = BLOG_KEYS[i]!;
            return (
              <Link
                key={post.href}
                href={post.href}
                className="group rounded-2xl border border-border/80 bg-card p-5 shadow-lo-card transition hover:border-primary/25 hover:shadow-lo-glow"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t(keys[0])}</span>
                <h3 className="mt-2 font-display text-base font-semibold text-foreground group-hover:text-primary">
                  {t(keys[1])}
                </h3>
                <p className="mt-2 text-sm text-primary group-hover:underline">{t("common.readMore")}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <footer className="mt-10 border-t border-border bg-secondary/30 safe-bottom sm:mt-14">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <Image src="/lofice-icon.png" alt="Loffice" width={36} height={36} className="h-9 w-9 rounded-lg" />
              <div>
                <p className="font-display font-bold text-primary">{t("common.brand")}</p>
                <p className="text-xs text-muted-foreground">{t("common.footerTagline")}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground sm:gap-5">
              {footerNav.map((item) => (
                <Link key={item.href + item.label} href={item.href} className="transition hover:text-foreground">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Loffice. {t("common.copyright")}
          </p>
        </div>
      </footer>
    </div>
  );
}
