"use client";

import Link from "next/link";
import { Download, Globe, Award, Monitor, Smartphone, FolderOpen, Settings, Chrome } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const PLATFORMS = [
  { icon: Chrome, labelKey: "platformWeb" as const, href: "/" },
  { icon: Monitor, labelKey: "platformWin" as const, href: "/settings/" },
  { icon: Smartphone, labelKey: "platformAndroid" as const, href: "/settings/" },
  { icon: FolderOpen, labelKey: "platformFiles" as const, href: "/files/" },
  { icon: Settings, labelKey: "platformSettings" as const, href: "/settings/" },
];

const STATS = [
  { icon: Download, labelKey: "statDownloads" as const },
  { icon: Globe, labelKey: "statCountries" as const },
  { icon: Award, labelKey: "statFormats" as const },
];

export default function LofficePolarisGlobal() {
  const { t } = useI18n();

  return (
    <section className="lo-polaris-global relative overflow-hidden py-14 text-white sm:py-20">
      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">
        <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
          {t("polaris.globalTitle")}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
          {STATS.map(({ icon: Icon, labelKey }) => (
            <div key={labelKey} className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                <Icon className="h-5 w-5 text-gold" strokeWidth={2} />
              </div>
              <p className="text-sm font-medium text-white/90 sm:text-base">{t(`polaris.${labelKey}`)}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3 sm:gap-4">
          {PLATFORMS.map(({ icon: Icon, labelKey, href }) => (
            <Link
              key={labelKey}
              href={href}
              className="flex w-24 flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-5 transition hover:bg-white/10 hover:scale-105 sm:w-28"
            >
              <Icon className="h-7 w-7" strokeWidth={1.5} />
              <span className="text-xs font-medium">{t(`polaris.${labelKey}`)}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
