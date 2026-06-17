"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Moon, Sun, User } from "lucide-react";
import LanguagePicker from "@/components/i18n/LanguagePicker";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/components/auth/AuthProvider";
import { useI18n } from "@/i18n/I18nProvider";

type Props = {
  dark: boolean;
  onToggleDark: () => void;
  onLoginClick?: () => void;
};

export default function LofficePolarisHeader({ dark, onToggleDark, onLoginClick }: Props) {
  const { t } = useI18n();
  const { user, profile } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const nav = [
    { label: t("nav.docEdit"), href: "/doc-edit/" },
    { label: t("nav.updates"), href: "/updates/" },
    { label: t("nav.myPage"), href: "/mypage/" },
  ];

  const openLogin = () => {
    if (onLoginClick) {
      onLoginClick();
      return;
    }
    setAuthOpen(true);
  };

  return (
    <>
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

            {user ? (
              <Link
                href="/mypage/"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
              >
                <User className="h-4 w-4" />
                <span className="max-w-[6rem] truncate">{profile?.displayName ?? t("nav.myPage")}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={openLogin}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
              >
                {t("polaris.login")}
              </button>
            )}

            <button
              type="button"
              className="inline-flex rounded-full border border-border/80 p-2.5 text-foreground/70 lg:hidden"
              aria-label="Menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
