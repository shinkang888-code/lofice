"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { openFileFromBase64 } from "@/lib/file-open-handler";

export function useElectronFileOpen() {
  const router = useRouter();

  useEffect(() => {
    const api = window.electronAPI;
    if (!api) return;

    const handleFile = async (detail: { name: string; data: string }) => {
      if (!detail?.data) return;
      try {
        await openFileFromBase64(detail.name, detail.data, router);
      } catch (err) {
        console.error("Failed to open file from Electron:", err);
      }
    };

    api.onOpenFile(handleFile);
    api.getPendingFile().then((pending) => {
      if (pending) handleFile(pending);
    });
  }, [router]);
}
