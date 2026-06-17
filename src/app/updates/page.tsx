"use client";

import { useState } from "react";
import Link from "next/link";
import LofficePolarisHeader from "@/components/home/polaris/LofficePolarisHeader";
import AuthModal from "@/components/auth/AuthModal";
import { useI18n } from "@/i18n/I18nProvider";
import { LOFFICE_RELEASE_NOTES } from "@/lib/lofficeUi/updates";

export default function UpdatesPage() {
  const { t, ready } = useI18n();
  const [dark, setDark] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center">Loading…</div>;
  }

  return (
    <div className={`min-h-screen bg-background ${dark ? "dark" : ""}`}>
      <LofficePolarisHeader
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
        onLoginClick={() => setAuthOpen(true)}
      />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link href="/" className="text-sm text-primary hover:underline">
          ← {t("common.brand")}
        </Link>
        <h1 className="font-display mt-4 text-2xl font-bold text-foreground sm:text-3xl">
          {t("updates.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("updates.pageDesc")}</p>

        <ul className="mt-8 space-y-3">
          {LOFFICE_RELEASE_NOTES.map((note) => (
            <li key={note.version} className="lo-polaris-card p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                  {note.version}
                </span>
                <span className="text-xs text-muted-foreground">{note.date}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                {t(note.messageKey, note.fallback)}
              </p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
