"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setError("Supabase 미설정");
      return;
    }
    void (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        const { error: err } = await sb.auth.exchangeCodeForSession(code);
        if (err) {
          setError(err.message);
          return;
        }
      }
      const { data, error: err } = await sb.auth.getSession();
      if (err) {
        setError(err.message);
        return;
      }
      if (data.session) {
        router.replace("/mypage/");
      } else {
        router.replace("/");
      }
    })();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">로그인 처리 중…</p>
        </>
      )}
    </div>
  );
}
