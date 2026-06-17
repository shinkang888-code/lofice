"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, findLocale, resolveMessageLocale } from "./locales";
import { loadMessages } from "./messages/loader";
import type { Messages } from "./types";
import { getByPath } from "./utils";

type I18nContextValue = {
  locale: string;
  messageLocale: string;
  messages: Messages | null;
  ready: boolean;
  setLocale: (code: string) => void;
  t: (key: string, fallback?: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);
  const [messages, setMessages] = useState<Messages | null>(null);
  const [ready, setReady] = useState(false);

  const messageLocale = useMemo(() => resolveMessageLocale(locale), [locale]);

  const applyLocale = useCallback(async (code: string) => {
    const msgLocale = resolveMessageLocale(code);
    const loaded = await loadMessages(msgLocale);
    setMessages(loaded);
    setLocaleState(code);
    setReady(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCALE_STORAGE_KEY, code);
      document.documentElement.lang = code.split("-")[0] ?? "en";
      const def = findLocale(code);
      document.documentElement.dir = def?.code.startsWith("ar") || def?.code === "he" || def?.code === "fa" || def?.code === "ur" ? "rtl" : "ltr";
    }
  }, []);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(LOCALE_STORAGE_KEY) : null;
    const initial = saved && findLocale(saved) ? saved : DEFAULT_LOCALE;
    void applyLocale(initial);
  }, [applyLocale]);

  const setLocale = useCallback(
    (code: string) => {
      void applyLocale(code);
    },
    [applyLocale],
  );

  const t = useCallback(
    (key: string, fallback?: string) => {
      if (!messages) return fallback ?? key;
      return getByPath(messages, key) ?? fallback ?? key;
    },
    [messages],
  );

  const value = useMemo(
    () => ({ locale, messageLocale, messages, ready, setLocale, t }),
    [locale, messageLocale, messages, ready, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useI18nOptional(): I18nContextValue | null {
  return useContext(I18nContext);
}
