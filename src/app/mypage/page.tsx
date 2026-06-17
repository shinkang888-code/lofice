"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, LogOut, User } from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useI18n } from "@/i18n/I18nProvider";

export default function MyPage() {
  const { t } = useI18n();
  const { user, profile, loading, openAuthModal, signOut, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setBio(profile.bio);
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile({ displayName, bio });
      setMessage(t("mypage.saved"));
    } catch (e) {
      setMessage(e instanceof Error ? e.message : t("mypage.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="flex min-h-screen flex-col pb-20">
        <AppHeader />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
          <User className="h-12 w-12 text-muted-foreground" />
          <p className="text-center text-sm text-muted-foreground">{t("mypage.loginRequired")}</p>
          <button
            type="button"
            onClick={openAuthModal}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            {t("auth.googleSignIn")}
          </button>
          <Link href="/" className="text-xs text-primary hover:underline">
            {t("mypage.backHome")}
          </Link>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col pb-20">
      <AppHeader />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
        <h1 className="text-xl font-bold text-foreground">{t("mypage.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("mypage.subtitle")}</p>

        <div className="mt-6 flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-7 w-7" />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold">{profile.displayName}</p>
            <p className="truncate text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">{t("mypage.displayName")}</span>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">{t("mypage.bio")}</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="mt-1 w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>
          <p className="text-xs text-muted-foreground">{t("mypage.emailReadonly")}: {profile.email}</p>
        </div>

        {message && <p className="mt-3 text-sm text-primary">{message}</p>}

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {saving ? t("mypage.saving") : t("mypage.save")}
          </button>
          <button
            type="button"
            onClick={() => void signOut()}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" />
            {t("mypage.signOut")}
          </button>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
