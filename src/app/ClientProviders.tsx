"use client";

import CapacitorProvider from "@/components/CapacitorProvider";
import AuthModalHost from "@/components/auth/AuthModalHost";
import PdfWorkerPreload from "@/components/pwa/PdfWorkerPreload";
import ThemeProvider from "@/components/settings/ThemeProvider";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { I18nProvider } from "@/i18n/I18nProvider";
import type { ReactNode } from "react";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <CapacitorProvider>
      <I18nProvider>
        <AuthProvider>
          <ThemeProvider>
            <PdfWorkerPreload />
            <AuthModalHost />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </I18nProvider>
    </CapacitorProvider>
  );
}
