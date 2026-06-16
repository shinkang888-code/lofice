"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";

export function useCapacitorInit() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    (async () => {
      try {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: "#003377" });
        await SplashScreen.hide();
      } catch { /* web fallback */ }
    })();
  }, []);
}

export function isNativeApp(): boolean {
  return Capacitor.isNativePlatform();
}
