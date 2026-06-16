"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { openFileFromBase64, openFileFromHandle } from "@/lib/file-open-handler";
import { useLoficeEvent } from "@/lib/reactTypes/hooks";

export function useAndroidFileIntent() {
  const router = useRouter();

  useLoficeEvent(
    "lofice:openFile",
    async (detail) => {
      if (!detail?.data) return;
      try {
        await openFileFromBase64(detail.name, detail.data, router);
      } catch (err) {
        console.error("Failed to open file from intent:", err);
      }
    },
    true,
  );
}

export function usePwaFileLaunch() {
  const router = useRouter();

  useEffect(() => {
    if (!("launchQueue" in window)) return;

    const w = window as Window & {
      launchQueue?: { setConsumer: (cb: (params: { files: FileSystemFileHandle[] }) => void) => void };
    };

    w.launchQueue?.setConsumer(async (launchParams) => {
      const files = launchParams.files;
      if (!files?.length) return;
      try {
        const file = await files[0].getFile();
        await openFileFromHandle(file, router);
      } catch (err) {
        console.error("PWA file launch failed:", err);
      }
    });
  }, [router]);
}
