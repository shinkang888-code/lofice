"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";

export type UserProfile = {
  displayName: string;
  email: string;
  avatarUrl: string | null;
  bio: string;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  configured: boolean;
  profile: UserProfile | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<UserProfile, "displayName" | "bio">>) => Promise<void>;
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function profileFromUser(user: User | null): UserProfile | null {
  if (!user) return null;
  const meta = user.user_metadata ?? {};
  return {
    displayName: (meta.display_name as string) || user.email?.split("@")[0] || "사용자",
    email: user.email ?? "",
    avatarUrl: (meta.avatar_url as string) || (meta.picture as string) || null,
    bio: (meta.bio as string) || "",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setLoading(false);
      return;
    }

    void sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = sb.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setUser(next?.user ?? null);
      if (next) setAuthModalOpen(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) throw new Error("Supabase가 설정되지 않았습니다.");
    const redirectTo = `${window.location.origin}/auth/callback/`;
    const { error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo, queryParams: { prompt: "consent" } },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    await sb.auth.signOut();
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<Pick<UserProfile, "displayName" | "bio">>) => {
      const sb = getSupabase();
      if (!sb || !user) throw new Error("로그인이 필요합니다.");
      const meta = { ...user.user_metadata };
      if (patch.displayName !== undefined) meta.display_name = patch.displayName;
      if (patch.bio !== undefined) meta.bio = patch.bio;
      const { data, error } = await sb.auth.updateUser({ data: meta });
      if (error) throw error;
      if (data.user) setUser(data.user);
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      configured,
      profile: profileFromUser(user),
      signInWithGoogle,
      signOut,
      updateProfile,
      authModalOpen,
      openAuthModal: () => setAuthModalOpen(true),
      closeAuthModal: () => setAuthModalOpen(false),
    }),
    [user, session, loading, configured, signInWithGoogle, signOut, updateProfile, authModalOpen],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
