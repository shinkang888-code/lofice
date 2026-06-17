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
import LofficeWorkspaceCard from "@/components/home/LofficeWorkspaceCard";
import { useI18n } from "@/i18n/I18nProvider";
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
  const [dark, setDark] = useState(false);

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
            href="/doc-edit/"
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
      <LofficePolarisGlobal />
      <LofficePolarisCta />
      <LofficePolarisFooter />
    </div>
  );
}
