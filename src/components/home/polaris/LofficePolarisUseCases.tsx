"use client";

import Link from "next/link";
import { GraduationCap, Briefcase, User, Heart } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function LofficePolarisUseCases() {
  const { t } = useI18n();

  return (
    <section className="bg-secondary/40 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {t("polaris.useCaseBadge")}
          </span>
          <h2 className="font-display mt-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            {t("polaris.useCaseTitle")}
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          <Link href="/word/" className="lo-polaris-card group relative overflow-hidden p-6 sm:p-8">
            <div className="relative z-10 max-w-[70%]">
              <h3 className="font-display text-xl font-bold text-blue-600 sm:text-2xl">
                {t("polaris.useCaseStudent")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t("polaris.useCaseStudentDesc")}
              </p>
            </div>
            <GraduationCap className="absolute bottom-6 right-6 h-20 w-20 text-primary/10 transition group-hover:scale-110 group-hover:text-primary/20" strokeWidth={1} />
          </Link>

          <Link href="/files/" className="lo-polaris-card group relative overflow-hidden p-6 sm:p-8">
            <div className="relative z-10 max-w-[70%]">
              <h3 className="font-display text-xl font-bold text-gold sm:text-2xl">
                {t("polaris.useCaseOffice")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t("polaris.useCaseOfficeDesc")}
              </p>
            </div>
            <Briefcase className="absolute bottom-6 right-6 h-20 w-20 text-primary/10 transition group-hover:scale-110 group-hover:text-primary/20" strokeWidth={1} />
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
          <div className="lo-polaris-card flex items-start justify-between gap-4 p-6">
            <div>
              <h3 className="font-display text-lg font-bold">
                <span className="text-orange-500">{t("polaris.personaFreelancer")}</span>
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t("polaris.personaFreelancerDesc")}</p>
            </div>
            <User className="h-14 w-14 shrink-0 text-muted-foreground/30" strokeWidth={1.25} />
          </div>
          <div className="lo-polaris-card flex items-start justify-between gap-4 p-6">
            <div>
              <h3 className="font-display text-lg font-bold">
                <span className="text-rose-500">{t("polaris.personaParent")}</span>
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t("polaris.personaParentDesc")}</p>
            </div>
            <Heart className="h-14 w-14 shrink-0 text-muted-foreground/30" strokeWidth={1.25} />
          </div>
        </div>
      </div>
    </section>
  );
}
