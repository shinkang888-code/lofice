"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Moon, Sun, X } from "lucide-react";
import LanguagePicker from "@/components/i18n/LanguagePicker";
import { useI18n } from "@/i18n/I18nProvider";
import { LOFFICE_HEADER_NAV } from "@/lib/lofficeUi/nav";

type Props = {
  dark: boolean;
  onToggleDark: () => void;
};

export default function LofficePolarisHeader({ dark, onToggleDark }: Props) {
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = LOFFICE_HEADER_NAV.filter((item) => item.href !== "/files/");

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl safe-top">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/lofice-icon.png"
            alt="Loffice"
            width={36}
            height={36}
            className="h-9 w-9 rounded-xl shadow-sm ring-1 ring-border/40"
            priority
          />
          <span className="font-display text-lg font-bold tracking-tight">
            <span className="text-primary">{t("common.brand")}</span>
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/files/"
            className="hidden items-center gap-1.5 rounded-full border border-border/80 px-3.5 py-2 text-sm font-medium text-foreground/80 transition hover:bg-secondary sm:inline-flex"
          >
            {t("polaris.myFiles")}
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-foreground/70 transition hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={onToggleDark}
            className="hidden rounded-full p-2.5 text-foreground/70 transition hover:bg-secondary sm:inline-flex"
            aria-label={t("common.themeToggle")}
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <LanguagePicker compact />

          <Link
            href="/mypage/"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
          >
            {t("polaris.login")}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex rounded-full border border-border/80 p-2.5 text-foreground/70 lg:hidden"
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav
          className="border-t border-border/50 bg-background/95 px-4 py-3 lg:hidden"
          aria-label="모바일 메뉴"
        >
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href="/files/"
                className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                onClick={() => setMobileOpen(false)}
              >
                {t("polaris.myFiles")}
              </Link>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/mypage/"
                className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-primary hover:bg-secondary"
                onClick={() => setMobileOpen(false)}
              >
                {t("polaris.login")}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
