"use client";

import { useCapacitorInit } from "@/lib/capacitor";
import { useAndroidFileIntent } from "@/lib/android-intent";
import { useElectronFileOpen } from "@/lib/electron-file";

export default function CapacitorProvider({ children }: { children: React.ReactNode }) {
  useCapacitorInit();
  useAndroidFileIntent();
  useElectronFileOpen();
  return <>{children}</>;
}
