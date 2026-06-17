import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
};

export function isAuthConfigured(): boolean {
  return isSupabaseConfigured();
}

export async function getSessionUser(): Promise<User | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session?.user ?? null;
}

export function toUserProfile(user: User): UserProfile {
  const meta = user.user_metadata as Record<string, string | undefined>;
  return {
    id: user.id,
    email: user.email ?? "",
    displayName: meta.full_name ?? meta.name ?? user.email?.split("@")[0] ?? "사용자",
    avatarUrl: meta.avatar_url ?? meta.picture ?? null,
  };
}

export async function signInWithGoogle(): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase가 설정되지 않았습니다.");
  const redirectTo = `${window.location.origin}/auth/callback/`;
  const { error } = await sb.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo, queryParams: { access_type: "offline", prompt: "consent" } },
  });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.auth.signOut();
}

export async function updateDisplayName(name: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase가 설정되지 않았습니다.");
  const { error } = await sb.auth.updateUser({ data: { full_name: name.trim() } });
  if (error) throw error;
}
