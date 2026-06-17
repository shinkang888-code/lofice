"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Globe, Search } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { filterLocales, findLocale, LOCALE_DEFINITIONS } from "@/i18n/locales";

type Props = {
  className?: string;
  compact?: boolean;
};

export default function LanguagePicker({ className = "", compact = false }: Props) {
  const { locale, setLocale, t, ready } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = findLocale(locale) ?? LOCALE_DEFINITIONS[0]!;
  const filtered = useMemo(() => filterLocales(query), [query]);

  useEffect(() => {
    if (!open) return;
    setHighlight(0);
    const tmr = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(tmr);
  }, [open, query]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.children[highlight] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  const select = (code: string) => {
    setLocale(code);
    setOpen(false);
    setQuery("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, Math.max(0, filtered.length - 1)));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
      return;
    }
    if (e.key === "Enter" && filtered.length > 0) {
      e.preventDefault();
      select(filtered[highlight]!.code);
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-border bg-white transition hover:bg-secondary dark:bg-card ${
          compact ? "px-2 py-1.5 text-xs" : "px-2.5 py-2 text-sm"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("common.language")}
      >
        <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span className="max-w-[7rem] truncate font-medium">{ready ? current.nativeName : "…"}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-72 overflow-hidden rounded-xl border border-border bg-white shadow-lo-glow dark:bg-card sm:w-80">
          <div className="border-b border-border p-2">
            <div className="flex items-center gap-2 rounded-lg bg-secondary/60 px-2.5 py-2">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={t("common.searchLanguage")}
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <ul
            ref={listRef}
            role="listbox"
            className="max-h-64 overflow-y-auto overscroll-contain py-1"
            aria-label={t("common.language")}
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">{t("common.noLanguageResults")}</li>
            ) : (
              filtered.map((item, i) => {
                const active = item.code === locale;
                const highlighted = i === highlight;
                return (
                  <li key={item.code} role="option" aria-selected={active}>
                    <button
                      type="button"
                      onMouseEnter={() => setHighlight(i)}
                      onClick={() => select(item.code)}
                      className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition ${
                        highlighted ? "bg-secondary" : "hover:bg-secondary/70"
                      } ${active ? "font-semibold text-primary" : ""}`}
                    >
                      <span className="text-base leading-none">{item.flag}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{item.nativeName}</span>
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {item.region} · {item.englishName}
                        </span>
                      </span>
                      {active && <Check className="h-4 w-4 shrink-0 text-primary" />}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
          <p className="border-t border-border px-3 py-1.5 text-[10px] text-muted-foreground">
            {LOCALE_DEFINITIONS.length} languages · ↑↓ Enter
          </p>
        </div>
      )}
    </div>
  );
}
