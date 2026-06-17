"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { Plus_Jakarta_Sans, Noto_Sans_KR } from "next/font/google";
import LofficePolarisHeader from "@/components/home/polaris/LofficePolarisHeader";
import LofficePolarisFooter from "@/components/home/polaris/LofficePolarisFooter";
import ProConvertWorkbench from "@/components/pro/ProConvertWorkbench";

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

function ProWorkbenchFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
      lofice Pro 불러오는 중…
    </div>
  );
}

export default function LofficeProPage() {
  const [dark, setDark] = useState(false);

  return (
    <div
      className={`loffice-site min-h-screen bg-background ${display.variable} ${sans.variable} font-sans ${dark ? "dark" : ""}`}
    >
      <LofficePolarisHeader dark={dark} onToggleDark={() => setDark((d) => !d)} />

      <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          ← lofice 홈
        </Link>
        <Suspense fallback={<ProWorkbenchFallback />}>
          <div className="mt-4">
            <ProConvertWorkbench />
          </div>
        </Suspense>
      </main>

      <LofficePolarisFooter />
    </div>
  );
}
