"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bot,
  FileText,
  Loader2,
  Send,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import {
  base64ToArrayBuffer,
  checkHwpxSkillHealth,
  hwpxSkillAiChat,
  hwpxSkillConvertHwp,
  hwpxSkillCreateFromMarkdown,
  hwpxSkillExtract,
} from "@/lib/hwpxSkill/api";
import { isHwpxSkillServerAvailable } from "@/lib/hwpxSkill/config";
import { extractHancomMarkdownClient, extractHancomTextClient } from "@/lib/hwpxSkill/clientExtract";
import {
  QUICK_PROMPTS,
  TEMPLATE_LABEL,
  type HwpxSkillHealth,
  type HwpxTemplateId,
} from "@/lib/hwpxSkill/types";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

interface Props {
  buffer?: ArrayBuffer | null;
  fileName?: string;
  onClose?: () => void;
  onDocumentCreated?: (buffer: ArrayBuffer, fileName: string) => void;
  className?: string;
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** hwpx-skill AI 한글 문서 어시스턴트 */
export default function HwpAiAssistant({
  buffer,
  fileName = "document.hwpx",
  onClose,
  onDocumentCreated,
  className = "",
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "hwpx-skill 기반 한글 AI 어시스턴트입니다. 보고서·공문·회의록 생성, HWP 변환, 텍스트 추출, 양식 편집을 요청해 보세요.",
    },
  ]);
  const [input, setInput] = useState("");
  const [template, setTemplate] = useState<HwpxTemplateId>("report");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<HwpxSkillHealth | null>(null);
  const [markdownDraft, setMarkdownDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const serverConfigured = isHwpxSkillServerAvailable();
  const hasDocument = Boolean(buffer && buffer.byteLength > 0);

  useEffect(() => {
    if (!serverConfigured) return;
    void checkHwpxSkillHealth().then(setHealth);
  }, [serverConfigured]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const pushMessage = useCallback((role: ChatMessage["role"], content: string) => {
    setMessages((prev) => [...prev, { id: uid(), role, content }]);
  }, []);

  const saveResult = useCallback(
    (dataBase64: string, outName: string, reply: string) => {
      const ab = base64ToArrayBuffer(dataBase64);
      onDocumentCreated?.(ab, outName);
      pushMessage("assistant", `${reply}\n\n파일 저장됨: ${outName}`);
    },
    [onDocumentCreated, pushMessage],
  );

  const runExtract = useCallback(async () => {
    if (!buffer) {
      setError("열린 문서가 없습니다.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let text: string;
      if (serverConfigured && health?.skill_ready) {
        const res = await hwpxSkillExtract(buffer, fileName, "markdown");
        text = res.text;
      } else {
        text = await extractHancomMarkdownClient(buffer);
      }
      pushMessage("assistant", `추출된 텍스트:\n\n${text.slice(0, 8000)}${text.length > 8000 ? "\n\n…(생략)" : ""}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "텍스트 추출 실패");
    } finally {
      setLoading(false);
    }
  }, [buffer, fileName, health?.skill_ready, pushMessage, serverConfigured]);

  const runConvert = useCallback(async () => {
    if (!buffer) {
      setError("HWP 파일이 필요합니다.");
      return;
    }
    if (!fileName.toLowerCase().endsWith(".hwp")) {
      setError("HWP 파일만 HWPX로 변환할 수 있습니다.");
      return;
    }
    if (!serverConfigured || !health?.skill_ready) {
      setError("hwpx-skill 서버가 필요합니다.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await hwpxSkillConvertHwp(buffer, fileName);
      saveResult(res.data_base64, res.file_name, "HWP → HWPX 변환이 완료되었습니다.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "변환 실패");
    } finally {
      setLoading(false);
    }
  }, [buffer, fileName, health?.skill_ready, saveResult, serverConfigured]);

  const runMarkdownCreate = useCallback(async () => {
    if (!markdownDraft.trim()) {
      setError("마크다운 내용을 입력하세요.");
      return;
    }
    if (!serverConfigured || !health?.skill_ready) {
      setError("hwpx-skill 서버가 필요합니다.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await hwpxSkillCreateFromMarkdown(markdownDraft, { template, title: "lofice 문서" });
      saveResult(res.data_base64, res.file_name, "마크다운에서 HWPX를 생성했습니다.");
      setMarkdownDraft("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "문서 생성 실패");
    } finally {
      setLoading(false);
    }
  }, [health?.skill_ready, markdownDraft, saveResult, serverConfigured, template]);

  const runAiChat = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      pushMessage("user", message);
      setInput("");
      setLoading(true);
      setError(null);

      try {
        let activeHealth = health;
        if (serverConfigured && !activeHealth) {
          activeHealth = await checkHwpxSkillHealth(true);
          setHealth(activeHealth);
        }

        if (serverConfigured && activeHealth?.ai_enabled) {
          let documentText: string | undefined;
          if (buffer) {
            documentText = activeHealth?.skill_ready
              ? (await hwpxSkillExtract(buffer, fileName, "plain")).text
              : await extractHancomTextClient(buffer);
          }

          const res = await hwpxSkillAiChat({
            message,
            template,
            documentText,
            fileBuffer: buffer ?? undefined,
            fileName,
          });

          if (res.data_base64 && res.file_name) {
            saveResult(res.data_base64, res.file_name, res.reply);
          } else {
            pushMessage("assistant", res.reply);
          }
          return;
        }

        if (serverConfigured && activeHealth?.skill_ready && !activeHealth.ai_enabled) {
          const sampleMd = `# ${message.slice(0, 40)}\n\n${message}\n\n## 개요\n\n(내용을 보완하세요)\n\n## 본문\n\n${message}`;
          const res = await hwpxSkillCreateFromMarkdown(sampleMd, { template, title: "AI 초안" });
          saveResult(res.data_base64, res.file_name, "AI 서버 키 없이 마크다운 초안을 HWPX로 생성했습니다.");
          return;
        }

        pushMessage(
          "assistant",
          "hwpx-skill API 서버(NEXT_PUBLIC_HWPX_SKILL_URL)를 설정하면 AI 문서 생성·변환·편집을 사용할 수 있습니다.\n\n로컬: services/hwpx-skill-api/README.md 참고",
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "AI 요청 실패");
        pushMessage("assistant", "요청 처리 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [buffer, fileName, health, pushMessage, saveResult, serverConfigured, template],
  );

  return (
    <div className={`flex flex-col h-full bg-white border-l border-gray-200 ${className}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 shrink-0 bg-[#f3f3f3]">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#2b579a]" />
          <span className="text-sm font-medium text-gray-800">한글 AI (hwpx-skill)</span>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="p-1 rounded hover:bg-gray-200">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="px-3 py-2 border-b border-gray-100 shrink-0 space-y-2">
        <label className="block text-[10px] text-gray-500">
          템플릿
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value as HwpxTemplateId)}
            className="mt-1 w-full text-xs border border-gray-200 rounded px-2 py-1.5 bg-white"
            disabled={loading}
          >
            {Object.entries(TEMPLATE_LABEL).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>

        {serverConfigured ? (
          <p className={`text-[10px] ${health?.skill_ready ? "text-green-700" : health === null ? "text-gray-500" : "text-amber-700"}`}>
            hwpx-skill: {health === null ? "연결 확인 중…" : health.skill_ready ? "연결됨" : "스크립트 없음"}
            {health?.ai_enabled ? " · AI 활성" : health ? " · AI 비활성(OPENAI_API_KEY)" : ""}
          </p>
        ) : (
          <p className="text-[10px] text-amber-700">hwpx-skill 서버 URL 미설정</p>
        )}

        <div className="flex flex-wrap gap-1">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q.id}
              type="button"
              disabled={loading}
              onClick={() => {
                setTemplate(q.template);
                if (q.id === "extract") void runExtract();
                else if (q.id === "convert") void runConvert();
                else void runAiChat(q.prompt);
              }}
              className="px-2 py-1 text-[10px] rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              {q.label}
            </button>
          ))}
        </div>

        {hasDocument && (
          <div className="flex gap-1">
            <button
              type="button"
              disabled={loading}
              onClick={() => void runExtract()}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] border rounded hover:bg-gray-50"
            >
              <FileText className="w-3 h-3" /> 텍스트 추출
            </button>
            {fileName.toLowerCase().endsWith(".hwp") && (
              <button
                type="button"
                disabled={loading}
                onClick={() => void runConvert()}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] border rounded hover:bg-gray-50"
              >
                <Wand2 className="w-3 h-3" /> HWP→HWPX
              </button>
            )}
          </div>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-auto p-3 space-y-2 min-h-0">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`text-xs rounded-lg px-2.5 py-2 whitespace-pre-wrap ${
              m.role === "user" ? "bg-[#2b579a]/10 text-gray-800 ml-4" : "bg-gray-50 text-gray-700 mr-4"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> 처리 중…
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-100 shrink-0 space-y-2">
        <details className="text-[10px] text-gray-500">
          <summary className="cursor-pointer flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> 마크다운 직접 → HWPX
          </summary>
          <textarea
            value={markdownDraft}
            onChange={(e) => setMarkdownDraft(e.target.value)}
            placeholder="# 제목&#10;&#10;본문..."
            className="mt-2 w-full h-24 text-xs border rounded p-2 font-mono"
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => void runMarkdownCreate()}
            className="mt-1 w-full py-1.5 text-xs bg-gray-800 text-white rounded"
          >
            HWPX 생성
          </button>
        </details>

        {error && <p className="text-[10px] text-red-600">{error}</p>}

        <form
          className="flex gap-1"
          onSubmit={(e) => {
            e.preventDefault();
            void runAiChat(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="예: 2025년 1분기 실적 보고서 작성해줘"
            className="flex-1 text-xs border rounded px-2 py-2"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-3 py-2 bg-[#2b579a] text-white rounded disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
