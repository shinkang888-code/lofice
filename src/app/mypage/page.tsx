"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, LogOut, Save, User } from "lucide-react";
import LofficePolarisHeader from "@/components/home/polaris/LofficePolarisHeader";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/components/auth/AuthProvider";
import { useI18n } from "@/i18n/I18nProvider";
import { signOut, updateDisplayName } from "@/lib/auth/supabase-auth";

export default function MyPage() {
  const { t, ready } = useI18n();
  const { user, profile, loading, configured } = useAuth();
  const [dark, setDark] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) setAuthOpen(true);
  }, [loading, user]);

  useEffect(() => {
    if (profile) setName(profile.displayName);
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updateDisplayName(name);
      setMessage(t("mypage.saved"));
    } catch (e) {
      setMessage(e instanceof Error ? e.message : t("mypage.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  if (!ready || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${dark ? "dark" : ""}`}>
      <LofficePolarisHeader
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
        onLoginClick={() => setAuthOpen(true)}
      />
      <AuthModal open={authOpen && !user} onClose={() => setAuthOpen(false)} />

      <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
        <h1 className="font-display text-2xl font-bold text-foreground">{t("mypage.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("mypage.subtitle")}</p>

        {!configured && (
          <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {t("auth.notConfigured")}
          </p>
        )}

        {user && profile && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-lo-card">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full ring-2 ring-border"
                  unoptimized
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-8 w-8" />
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">{profile.displayName}</p>
                <p className="truncate text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-lo-card">
              <div>
                <label htmlFor="display-name" className="text-sm font-medium text-foreground">
                  {t("mypage.displayName")}
                </label>
                <input
                  id="display-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">{t("mypage.email")}</label>
                <p className="mt-1.5 rounded-xl border border-border/60 bg-secondary/40 px-3 py-2.5 text-sm text-muted-foreground">
                  {profile.email}
                </p>
              </div>

              {message && <p className="text-xs text-primary">{message}</p>}

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={saving || !name.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {t("mypage.save")}
                </button>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  <LogOut className="h-4 w-4" />
                  {t("mypage.signOut")}
                </button>
              </div>
            </div>

            <Link href="/files/" className="block text-center text-sm text-primary hover:underline">
              {t("mypage.goFiles")} →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
