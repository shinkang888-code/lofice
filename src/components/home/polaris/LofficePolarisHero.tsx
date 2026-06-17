"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";
import LofficeAiChat from "@/components/home/LofficeAiChat";

const AI_BADGES = [
  { label: "HWP", bg: "bg-blue-600 text-white", delay: "" },
  { label: "PDF", bg: "bg-red-500 text-white", delay: "lo-float-delay-1" },
  { label: "AI", bg: "bg-violet-500 text-white", delay: "lo-float-delay-2" },
  { label: "DOC", bg: "bg-emerald-600 text-white", delay: "lo-float-delay-3" },
  { label: "PPT", bg: "bg-orange-500 text-white", delay: "" },
];

const SUGGEST_ROUTES = ["/pdf-editor/", "/ppt-ai/", "/hwp-editor/"] as const;

export default function LofficePolarisHero() {
  const { t } = useI18n();
  const router = useRouter();

  const suggests = [
    t("polaris.suggest1"),
    t("polaris.suggest2"),
    t("polaris.suggest3"),
  ];

  return (
    <section className="lo-polaris-hero relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 lo-hero-grid opacity-40" />
      <div className="relative mx-auto max-w-4xl px-4 pb-6 pt-10 text-center sm:px-6 sm:pb-8 sm:pt-14">
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
          {t("polaris.aiBadge")}
        </p>
        <h1 className="font-display mt-2 text-balance text-3xl font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-[2.75rem]">
          {t("polaris.aiTitle")}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t("polaris.aiSubtitle")}
        </p>

        <div className="mt-6 sm:mt-8">
          <LofficeAiChat />
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {suggests.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => router.push(SUGGEST_ROUTES[i] ?? "/")}
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
