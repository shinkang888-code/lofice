"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import { LOFFICE_BLOG_POSTS } from "@/lib/lofficeUi/nav";

const NEWS_KEYS = [
  { title: "polaris.news1Title", tag: "polaris.tagGuide" },
  { title: "polaris.news2Title", tag: "blog.tagAi" },
  { title: "polaris.news3Title", tag: "polaris.tagInsight" },
  { title: "polaris.news4Title", tag: "polaris.tagUsage" },
] as const;

export default function LofficePolarisNews() {
  const { t } = useI18n();

  return (
    <section id="blog" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{t("polaris.newsTitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">{t("polaris.newsSubtitle")}</p>
        <Link
          href="#blog"
          className="mt-4 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
        >
          {t("polaris.newsViewAll")}
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {LOFFICE_BLOG_POSTS.map((post, i) => {
          const meta = NEWS_KEYS[i]!;
          return (
            <Link
              key={post.href}
              href={post.href}
              className="lo-polaris-news-card group flex min-h-[11rem] flex-col justify-between p-6 text-left transition hover:scale-[1.01] sm:p-7"
            >
              <h3 className="relative z-10 max-w-[85%] font-display text-lg font-bold leading-snug text-white sm:text-xl">
                {t(meta.title)}
              </h3>
              <span className="relative z-10 mt-4 text-xs font-medium text-white/60">
                {t(meta.tag)}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
