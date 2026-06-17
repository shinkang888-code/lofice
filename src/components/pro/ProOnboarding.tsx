"use client";

import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "lofice-pro-onboarding-done";

export default function ProOnboarding() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative rounded-2xl border border-[var(--lofice-gold)]/40 bg-[var(--lofice-gold)]/10 p-4 pr-10">
      <button
        type="button"
        aria-label="닫기"
        onClick={() => {
          localStorage.setItem(STORAGE_KEY, "1");
          setVisible(false);
        }}
        className="absolute right-3 top-3 rounded-lg p-1 text-muted-foreground hover:bg-background/50"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="flex items-center gap-2 text-xs font-bold text-foreground">
        <Sparkles className="h-4 w-4 text-primary" />
        lofice Pro 시작하기
      </p>
      <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-muted-foreground">
        <li>아래 <strong className="text-foreground">Pro API URL</strong> 입력 (나중에 Docker 연결 가능)</li>
        <li><strong className="text-foreground">연결 테스트</strong>로 엔진 상태 확인</li>
        <li>파일 업로드 → 출력 형식 선택 → <strong className="text-foreground">Pro 변환</strong></li>
      </ol>
      <Link href="/convert/" className="mt-2 inline-block text-[10px] font-medium text-primary hover:underline">
        브라우저 변환은 /convert/ 에서 →
      </Link>
    </div>
  );
}
