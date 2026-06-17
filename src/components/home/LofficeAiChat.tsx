"use client";

import { useRef, useState, type DragEvent, type ChangeEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  CloudUpload,
  FolderOpen,
  Loader2,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { ACCEPT_EXTENSIONS } from "@/lib/document-types";
import { getDocTypeBadge, formatBytes } from "@/lib/lofficeUi/doc-type";
import { openLocalDocument } from "@/lib/lofficeUi/routes";
import { chatWithGemini, isGeminiConfigured, type GeminiMessage } from "@/lib/ai/gemini-client";

type ChatItem = { role: "user" | "model"; text: string };

export default function LofficeAiChat() {
  const { t } = useI18n();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [opening, setOpening] = useState<string | null>(null);

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((prev) => [...Array.from(list), ...prev].slice(0, 8));
  };

  const openFile = async (file: File) => {
    setOpening(file.name);
    try {
      await openLocalDocument(file, router.push);
    } finally {
      setOpening(null);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const list = e.dataTransfer.files;
    if (list.length === 1) {
      void openFile(list[0]!);
      return;
    }
    handleFiles(list);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: ChatItem = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    try {
      const history: GeminiMessage[] = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));
      const reply = await chatWithGemini(history, text);
      setMessages((prev) => [...prev, { role: "model", text: reply }]);
      requestAnimationFrame(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }));
    } catch (e) {
      const err = e instanceof Error ? e.message : t("aiChat.error");
      setMessages((prev) => [...prev, { role: "model", text: err }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  const geminiReady = isGeminiConfigured();

  return (
    <div className="mx-auto w-full max-w-3xl text-left">
      {messages.length > 0 && (
        <div
          ref={listRef}
          className="mb-3 max-h-56 space-y-2 overflow-y-auto rounded-2xl border border-border/80 bg-card/90 p-3 shadow-lo-card backdrop-blur-sm sm:max-h-64"
        >
          {messages.map((m, i) => (
            <div
              key={`${m.role}-${i}`}
              className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-violet-100 text-violet-700"
                }`}
              >
                {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>
              <p
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                {m.text}
              </p>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {t("aiChat.thinking")}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <div className="flex min-h-[52px] flex-1 items-end gap-2 rounded-2xl border border-border/80 bg-card/95 px-3 py-2.5 shadow-lo-card backdrop-blur-sm transition focus-within:border-violet-400/50 focus-within:ring-2 focus-within:ring-violet-400/20 sm:rounded-2xl sm:px-4">
          <Sparkles className="mb-1.5 h-5 w-5 shrink-0 text-violet-500" strokeWidth={2} />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder={t("aiChat.placeholder")}
            className="max-h-28 min-h-[28px] w-full resize-none bg-transparent text-base outline-none placeholder:text-muted-foreground/70"
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={!input.trim() || loading}
            className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-700 disabled:opacity-40"
            aria-label={t("aiChat.send")}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex min-h-[52px] shrink-0 items-center justify-center gap-2 rounded-2xl border-2 border-gold/80 bg-gold px-6 text-base font-bold text-gold-foreground shadow-md transition hover:brightness-105 active:scale-[0.98] sm:min-w-[148px]"
        >
          <FolderOpen className="h-5 w-5" strokeWidth={2.25} />
          <span className="whitespace-nowrap">{t("common.openDocument")}</span>
        </button>
      </div>

      {!geminiReady && (
        <p className="mt-2 text-center text-[11px] text-muted-foreground">{t("aiChat.demoHint")}</p>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
        }}
        className={`mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-2.5 text-xs transition sm:text-sm ${
          dragOver
            ? "border-gold bg-gold/15 text-foreground"
            : "border-border/80 bg-card/60 text-muted-foreground hover:border-primary/30 hover:bg-card"
        }`}
      >
        <CloudUpload className="h-4 w-4 shrink-0 opacity-70" />
        <span>{t("hero.dropHint")}</span>
        <span className="hidden text-muted-foreground/70 sm:inline">·</span>
        <span className="hidden text-[11px] text-muted-foreground/80 sm:inline">{t("hero.formats")}</span>
      </div>

      <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <CloudUpload className="h-3 w-3" />
        {t("hero.cloudNote")}
      </p>

      <input
        ref={fileRef}
        type="file"
        multiple
        accept={ACCEPT_EXTENSIONS}
        className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const list = e.target.files;
          if (list?.length === 1) {
            void openFile(list[0]!);
          } else {
            handleFiles(list);
          }
          e.target.value = "";
        }}
      />

      {files.length > 0 && (
        <ul className="mt-3 space-y-1.5 rounded-xl border border-border bg-card p-2.5 shadow-lo-card">
          {files.map((f, i) => {
            const badge = getDocTypeBadge(f.name);
            const busy = opening === f.name;
            return (
              <li
                key={`${f.name}-${i}`}
                className="flex items-center gap-2.5 rounded-lg p-2 transition hover:bg-secondary/50"
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${badge.color}`}>
                  {badge.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{f.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {badge.label} · {formatBytes(f.size)}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void openFile(f)}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {busy ? t("common.opening") : t("common.open")}
                </button>
                <button
                  type="button"
                  onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="rounded-md p-1 text-muted-foreground hover:bg-secondary"
                  aria-label={t("common.remove")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
