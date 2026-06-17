"use client";

import { useCallback, useEffect, useState } from "react";
import { getOfficeConvertUrl, getOfficeConvertSource } from "@/lib/convert/config";
import {
  getStoredProApiUrl,
  PRO_API_URL_CHANGED,
  saveStoredProApiUrl,
} from "./settings";

export function useProApiUrl() {
  const [url, setUrl] = useState<string | null>(null);
  const [source, setSource] = useState<"stored" | "env" | "default" | "none">("none");

  const sync = useCallback(() => {
    setUrl(getOfficeConvertUrl());
    setSource(getOfficeConvertSource());
  }, []);

  useEffect(() => {
    sync();
    const onChange = () => sync();
    window.addEventListener(PRO_API_URL_CHANGED, onChange);
    return () => window.removeEventListener(PRO_API_URL_CHANGED, onChange);
  }, [sync]);

  const save = useCallback(
    (next: string | null) => {
      saveStoredProApiUrl(next);
      sync();
    },
    [sync],
  );

  return {
    url,
    source,
    storedUrl: typeof window !== "undefined" ? getStoredProApiUrl() : null,
    save,
    refresh: sync,
  };
}
