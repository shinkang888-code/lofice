"use client";

import { useEffect } from "react";
import { applyTheme, loadPreferences } from "@/lib/officeTool/preferences";

/** 마운트 시 저장된 테마 적용 (Office Tool Plus 설정 패턴) */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyTheme(loadPreferences().theme);
  }, []);
  return <>{children}</>;
}
