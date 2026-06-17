"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";

function ConvertVisual() {
  return (
    <div className="flex h-full items-center justify-center gap-3 p-6">
      <div className="rounded-lg bg-red-500/90 px-3 py-4 text-center text-[10px] font-bold text-white shadow-lg">PDF</div>
      <div className="flex flex-col gap-1 text-primary">
        <span className="text-lg">⇄</span>
      </div>
      <div className="rounded-lg bg-blue-600/90 px-3 py-4 text-center text-[10px] font-bold text-white shadow-lg">DOC</div>
    </div>
  );
}

function PptVisual() {
  return (
    <div className="p-4">
      <div className="rounded-xl border border-border/60 bg-white/80 p-3 shadow-sm backdrop-blur">
        <div className="mb-2 h-2 w-16 rounded-full bg-primary/20" />
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded bg-muted" />
          <div className="h-1.5 w-4/5 rounded bg-muted" />
        </div>
        <div className="mt-3 flex gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 flex-1 rounded bg-gradient-to-br from-primary/30 to-gold/40" />
          ))}
        </div>
      </div>
    </div>
  );
}

function OcrVisual() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="relative">
        <div className="rounded-xl border-2 border-dashed border-primary/30 bg-white/70 px-6 py-5 text-2xl font-serif text-foreground/40">
          Aa
        </div>
        <div className="absolute -bottom-2 -right-2 rounded-lg bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground shadow">
          OCR
        </div>
      </div>
    </div>
  );
}

function AiVisual() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-primary shadow-lg">
        <span className="text-2xl">✦</span>
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gold shadow" />
      </div>
    </div>
  );
}

const FEATURES = [
  { key: "featStyle", visual: ConvertVisual, href: "/convert/", badge: null },
  { key: "featPpt", visual: PptVisual, href: "/ppt-ai/", badge: "new" as const },
  { key: "featTranslate", visual: OcrVisual, href: "/ocr/", badge: null },
  { key: "featVoice", visual: AiVisual, href: "/hwp-ai/", badge: "popular" as const },
] as const;

export default function LofficePolarisFeatureBento() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {FEATURES.map(({ key, visual: Visual, href, badge }) => (
          <Link key={key} href={href} className="lo-polaris-card group overflow-hidden">
            <div className="lo-polaris-bento-visual">
              <Visual />
              {badge === "new" && (
                <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {t("polaris.newBadge")}
                </span>
              )}
              {badge === "popular" && (
                <span className="absolute left-3 top-3 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-gold-foreground">
                  {t("polaris.popularBadge")}
                </span>
              )}
            </div>
            <div className="p-4 sm:p-5">
              <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary">
                {t(`polaris.${key}Title` as "polaris.featStyleTitle")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t(`polaris.${key}Desc` as "polaris.featStyleDesc")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
