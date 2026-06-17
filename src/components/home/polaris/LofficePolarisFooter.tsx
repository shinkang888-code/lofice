"use client";

import Image from "next/image";
import Link from "next/link";
import LanguagePicker from "@/components/i18n/LanguagePicker";
import { useI18n } from "@/i18n/I18nProvider";

export default function LofficePolarisFooter() {
  const { t } = useI18n();

  const links = [
    { label: t("nav.updatesFooter"), href: "/updates/" },
    { label: t("nav.myPage"), href: "/mypage/" },
    { label: t("nav.settings"), href: "/settings/" },
  ];

  return (
    <footer className="border-t border-border bg-background safe-bottom">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-6 border-b border-border/60 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Image src="/lofice-icon.png" alt="Loffice" width={40} height={40} className="h-10 w-10 rounded-xl" />
            <div>
              <p className="font-display font-bold text-primary">{t("common.brand")}</p>
              <p className="text-xs text-muted-foreground">{t("common.footerTagline")}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <LanguagePicker />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground sm:gap-6">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Loffice. {t("common.copyright")}
        </p>
      </div>
    </footer>
  );
}
