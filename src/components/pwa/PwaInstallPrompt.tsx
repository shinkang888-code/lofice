"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { isNativeApp } from "@/lib/capacitor";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isNativeApp()) return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem("lofice-pwa-dismissed")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferred || dismissed || isNativeApp()) return null;

  const install = async () => {
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setDeferred(null);
    setDismissed(true);
  };

  return (
    <div className="mx-4 mb-4 p-4 bg-lofice-navy text-white rounded-xl shadow-lg flex items-start gap-3">
      <Download className="w-5 h-5 text-lofice-gold shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">lofice 앱 설치</p>
        <p className="text-xs text-white/80 mt-1">
          홈 화면에 추가하면 문서 뷰어로 바로 열 수 있습니다.
        </p>
        <button
          type="button"
          onClick={install}
          className="mt-2 px-4 py-1.5 bg-lofice-gold text-lofice-navy text-xs font-bold rounded-lg"
        >
          설치하기
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem("lofice-pwa-dismissed", "1");
          setDismissed(true);
        }}
        className="text-white/60 hover:text-white"
        aria-label="닫기"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
