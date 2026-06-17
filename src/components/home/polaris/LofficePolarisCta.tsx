"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function LofficePolarisCta() {
  const { t } = useI18n();

  return (
    <section className="lo-polaris-cta relative overflow-hidden py-12 sm:py-16">
      <div className="pointer-events-none absolute -right-8 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 text-8xl font-bold text-primary/5">
        ✦
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("polaris.ctaTitle")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">{t("polaris.ctaSubtitle")}</p>
        </div>
        <Link
          href="/files/"
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition hover:opacity-90"
        >
          {t("polaris.ctaButton")}
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition group-hover:translate-x-0.5">
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </section>
  );
}
