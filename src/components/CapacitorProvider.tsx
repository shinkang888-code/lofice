"use client";

import { useCapacitorInit } from "@/lib/capacitor";
import { useAndroidFileIntent, usePwaFileLaunch } from "@/lib/android-intent";
import { useElectronFileOpen } from "@/lib/electron-file";

export default function CapacitorProvider({ children }: { children: React.ReactNode }) {
  useCapacitorInit();
  useAndroidFileIntent();
  usePwaFileLaunch();
  useElectronFileOpen();
  return <>{children}</>;
}
