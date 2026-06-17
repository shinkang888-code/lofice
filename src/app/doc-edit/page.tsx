"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus_Jakarta_Sans, Noto_Sans_KR } from "next/font/google";
import LofficePolarisHeader from "@/components/home/polaris/LofficePolarisHeader";
import LofficePolarisFooter from "@/components/home/polaris/LofficePolarisFooter";
import LofficeDocEditDashboard from "@/components/home/LofficeDocEditDashboard";
import { useI18n } from "@/i18n/I18nProvider";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const sans = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export default function DocEditPage() {
  const { t, ready } = useI18n();
  const [dark, setDark] = useState(false);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div
      className={`loffice-site min-h-screen bg-background ${display.variable} ${sans.variable} font-sans ${dark ? "dark" : ""}`}
    >
      <LofficePolarisHeader dark={dark} onToggleDark={() => setDark((d) => !d)} />

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10">
        <Link href="/" className="text-sm text-primary hover:underline">
          ← {t("common.brand")}
        </Link>
        <h1 className="font-display mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {t("nav.docEdit")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("docEdit.pageDesc")}</p>
      </main>

      <LofficeDocEditDashboard />
      <LofficePolarisFooter />
    </div>
  );
}
