"use client";

import { useI18n } from "@/i18n/I18nProvider";
import LofficeHeroSearch from "@/components/home/LofficeHeroSearch";

const AI_BADGES = [
  { label: "HWP", bg: "bg-blue-600 text-white", delay: "" },
  { label: "PDF", bg: "bg-red-500 text-white", delay: "lo-float-delay-1" },
  { label: "AI", bg: "bg-violet-500 text-white", delay: "lo-float-delay-2" },
  { label: "DOC", bg: "bg-emerald-600 text-white", delay: "lo-float-delay-3" },
  { label: "PPT", bg: "bg-orange-500 text-white", delay: "" },
];

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  resultCount?: number;
  onSuggest: (value: string) => void;
};

export default function LofficePolarisHero({ search, onSearchChange, resultCount, onSuggest }: Props) {
  const { t } = useI18n();

  const suggests = [
    t("polaris.suggest1"),
    t("polaris.suggest2"),
    t("polaris.suggest3"),
  ];

  return (
    <section className="lo-polaris-hero relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 lo-hero-grid opacity-40" />
      <div className="relative mx-auto max-w-4xl px-4 pb-8 pt-10 text-center sm:px-6 sm:pb-10 sm:pt-14">
        <div className="lo-ai-orbit mb-5">
          {AI_BADGES.map((b) => (
            <span
              key={b.label}
              className={`lo-ai-badge lo-float ${b.delay} ${b.bg}`}
            >
              {b.label}
            </span>
          ))}
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80 sm:text-sm">
          {t("polaris.novaBadge")}
        </p>
        <h1 className="font-display mt-2 text-balance text-3xl font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-[2.75rem]">
          {t("polaris.novaTitle")}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t("polaris.novaSubtitle")}
        </p>

        <div className="mt-6 sm:mt-8">
          <LofficeHeroSearch
            variant="polaris"
            search={search}
            onSearchChange={onSearchChange}
            resultCount={resultCount}
          />
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {suggests.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSuggest(s.replace(/^[^\s]+\s/, ""))}
              className="lo-polaris-chip"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
