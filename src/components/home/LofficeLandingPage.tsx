"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus_Jakarta_Sans, Noto_Sans_KR } from "next/font/google";
import {
  BookOpen,
  ChevronDown,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import LofficePolarisHeader from "@/components/home/polaris/LofficePolarisHeader";
import LofficePolarisHero from "@/components/home/polaris/LofficePolarisHero";
import LofficePolarisFeatureBento from "@/components/home/polaris/LofficePolarisFeatureBento";
import LofficePolarisUseCases from "@/components/home/polaris/LofficePolarisUseCases";
import LofficePolarisGlobal from "@/components/home/polaris/LofficePolarisGlobal";
import LofficePolarisCta from "@/components/home/polaris/LofficePolarisCta";
import LofficePolarisFooter from "@/components/home/polaris/LofficePolarisFooter";
import LofficeToolSection from "@/components/home/LofficeToolSection";
import LofficeWorkspaceCard from "@/components/home/LofficeWorkspaceCard";
import { useI18n } from "@/i18n/I18nProvider";
import {
  ALL_LOFFICE_TOOLS,
  LOFFICE_DOC_TOOLS,
  LOFFICE_AI_TOOLS,
  LOFFICE_CONVERT_TOOLS,
  LOFFICE_ANALYZE_TOOLS,
} from "@/lib/lofficeUi/tools";
import { POPULAR_TOOL_NAMES, getToolIconStyle } from "@/lib/lofficeUi/tool-icons";
import { useToolLabeler } from "@/lib/lofficeUi/useLocalizedTool";
import { LOFFICE_QUICK_CARDS } from "@/lib/lofficeUi/nav";

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

export default function LofficeLandingPage() {
  const { t, ready } = useI18n();
  const labelTool = useToolLabeler();
  const [dark, setDark] = useState(false);

  const popularTools = POPULAR_TOOL_NAMES.map((id) => ALL_LOFFICE_TOOLS.find((tool) => tool.id === id)).filter(Boolean);

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
      <LofficePolarisHeader dark={dark} onToggleDark={() => setDark((d) => !d)} />

      <LofficePolarisHero />

      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6">
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

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
          <LofficeWorkspaceCard />

          <div className="grid grid-rows-3 gap-3 sm:gap-4">
            {LOFFICE_QUICK_CARDS.map((c, i) => {
              const Icon = QUICK_ICONS[i] ?? Sparkles;
              const keys = QUICK_KEYS[i]!;
              return (
                <Link
                  key={c.href}
                  href={c.href}
                  className="lo-polaris-card group flex items-start justify-between gap-3 p-4 sm:p-4"
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

      <LofficePolarisFeatureBento />
      <LofficePolarisUseCases />

      {popularTools.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10">
          <div className="mb-4">
            <div className="mb-2 h-1 w-10 rounded-full bg-gradient-to-r from-gold/80 to-primary/80" />
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
                  className="lo-polaris-card group relative overflow-hidden p-5"
                >
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}>
                    <Icon className={`h-6 w-6 ${fg}`} strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground">{label.name}</h3>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{label.desc}</p>
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
        title={t("sections.docTitle")}
        description={t("sections.docDesc")}
        tools={LOFFICE_DOC_TOOLS}
      />
      <LofficeToolSection
        id="ai"
        category="ai"
        title={t("sections.aiTitle")}
        description={t("sections.aiDesc")}
        tools={LOFFICE_AI_TOOLS}
        delay={40}
      />
      <LofficeToolSection
        id="convert"
        category="convert"
        title={t("sections.convertTitle")}
        description={t("sections.convertDesc")}
        tools={LOFFICE_CONVERT_TOOLS}
        delay={80}
      />
      <LofficeToolSection
        id="analyze"
        category="analyze"
        title={t("sections.analyzeTitle")}
        description={t("sections.analyzeDesc")}
        tools={LOFFICE_ANALYZE_TOOLS}
        delay={120}
      />

      <LofficePolarisGlobal />
      <LofficePolarisCta />
      <LofficePolarisFooter />
    </div>
  );
}
