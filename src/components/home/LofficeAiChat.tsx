"use client";

import { useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles, User } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { chatWithGemini, isGeminiConfigured, type GeminiMessage } from "@/lib/ai/gemini-client";

type ChatItem = { role: "user" | "model"; text: string };

type Props = {
  onSuggest?: (text: string) => void;
};

export default function LofficeAiChat({ onSuggest }: Props) {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const configured = isGeminiConfigured();

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    const userMsg: ChatItem = { role: "user", text: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    scrollToBottom();

    try {
      const history: GeminiMessage[] = next.map((m) => ({ role: m.role, text: m.text }));
      const reply = await chatWithGemini(history, t("aiChat.systemPrompt"));
      setMessages((prev) => [...prev, { role: "model", text: reply }]);
      scrollToBottom();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("aiChat.error"));
    } finally {
      setLoading(false);
    }
  };

  const suggests = [t("polaris.suggest1"), t("polaris.suggest2"), t("polaris.suggest3")];

  return (
    <div className="mx-auto w-full max-w-3xl text-left">
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-lo-card">
        <div className="flex items-center gap-2 border-b border-border/60 bg-gradient-to-r from-primary/5 to-violet-500/5 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/15 text-violet-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">{t("aiChat.title")}</p>
            <p className="truncate text-[11px] text-muted-foreground">{t("aiChat.subtitle")}</p>
          </div>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
            Gemini
          </span>
        </div>

        <div ref={listRef} className="max-h-[220px] min-h-[120px] overflow-y-auto px-4 py-3 sm:max-h-[260px]">
          {messages.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{t("aiChat.empty")}</p>
          ) : (
            <ul className="space-y-3">
              {messages.map((m, i) => (
                <li key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      m.role === "user" ? "bg-primary/15 text-primary" : "bg-violet-500/15 text-violet-600"
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
                </li>
              ))}
              {loading && (
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("aiChat.thinking")}
                </li>
              )}
            </ul>
          )}
        </div>

        {!configured && (
          <p className="border-t border-border/60 bg-amber-50 px-4 py-2 text-[11px] text-amber-800">
            {t("aiChat.notConfigured")}
          </p>
        )}

        {error && (
          <p className="border-t border-border/60 px-4 py-2 text-xs text-red-600">{error}</p>
        )}

        <form
          className="flex items-end gap-2 border-t border-border/60 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            rows={1}
            placeholder={t("aiChat.placeholder")}
            disabled={loading || !configured}
            className="max-h-24 min-h-[44px] flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-primary/50 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || !configured}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-700 disabled:opacity-40"
            aria-label={t("aiChat.send")}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </form>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {suggests.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              const text = s.replace(/^[^\s]+\s/, "");
              onSuggest?.(text);
              void send(text);
            }}
            className="lo-polaris-chip"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
