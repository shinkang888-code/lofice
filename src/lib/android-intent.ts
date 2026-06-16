"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { openFileFromBase64 } from "@/lib/file-open-handler";

export function useAndroidFileIntent() {
  const router = useRouter();

  useEffect(() => {
    const handler = async (e: Event) => {
      const detail = (e as CustomEvent).detail as { name: string; data: string };
      if (!detail?.data) return;
      try {
        await openFileFromBase64(detail.name, detail.data, router);
      } catch (err) {
        console.error("Failed to open file from intent:", err);
      }
    };
    window.addEventListener("oneoffice:openFile", handler);
    return () => window.removeEventListener("oneoffice:openFile", handler);
  }, [router]);
}
