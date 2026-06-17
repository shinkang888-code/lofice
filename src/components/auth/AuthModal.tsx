"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useI18n } from "@/i18n/I18nProvider";

export default function AuthModal() {
  const { authModalOpen, closeAuthModal, signInWithGoogle, configured } = useAuth();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("auth.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label={t("auth.close")}
        onClick={closeAuthModal}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-2xl dark:bg-card">
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-secondary"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="font-display text-xl font-bold text-foreground">{t("auth.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("auth.subtitle")}</p>

        {!configured && (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            {t("auth.notConfigured")}
          </p>
        )}

        <button
          type="button"
          disabled={loading || !configured}
          onClick={() => void handleGoogle()}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          )}
          {t("auth.googleSignIn")}
        </button>

        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

        <p className="mt-4 text-center text-[11px] text-muted-foreground">{t("auth.terms")}</p>
      </div>
    </div>
  );
}
