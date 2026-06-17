"use client";

import Link from "next/link";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { useI18n } from "@/i18n/I18nProvider";

const UPDATE_KEYS = [
  "updates.v221",
  "updates.v219",
  "updates.v218",
  "updates.v217",
  "updates.v216",
  "updates.v212",
  "updates.v211",
  "updates.v210",
  "updates.v207",
] as const;

const UPDATE_VERSIONS = [
  "v2.21.0",
  "v2.19.0",
  "v2.18.0",
  "v2.17.0",
  "v2.16.0",
  "v2.12.0",
  "v2.11.0",
  "v2.10.0",
  "v2.7.0",
] as const;

export default function UpdatesPage() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col pb-20">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <Link href="/" className="text-xs text-primary hover:underline">
          ← {t("mypage.backHome")}
        </Link>
        <h1 className="mt-4 font-display text-2xl font-bold">{t("updates.title")}</h1>
        <ul className="mt-6 space-y-3">
          {UPDATE_KEYS.map((key, i) => (
            <li key={key} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                  {UPDATE_VERSIONS[i]}
                </span>
                <span className="text-xs text-muted-foreground">2026-06</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed">{t(key)}</p>
            </li>
          ))}
        </ul>
      </main>
      <BottomNav />
    </div>
  );
}
