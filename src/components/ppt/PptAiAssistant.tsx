"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bot,
  Download,
  FileText,
  Loader2,
  Presentation,
  Sparkles,
  Wand2,
} from "lucide-react";
import {
  PPT_COLOR_SCHEMES,
  type PptColorSchemeId,
} from "@/lib/pptMcp/color-schemes";
import {
  PPT_QUICK_SEQUENCES,
  PPT_SLIDE_TEMPLATES,
} from "@/lib/pptMcp/templates";
import { createPresentationFromTemplates } from "@/lib/pptMcp/template-builder";
import { extractPresentationTextClient } from "@/lib/pptMcp/text-extract";
import { downloadPptx } from "@/lib/ppt/pptx-export";
import {
  checkPptMcpHealth,
  pptMcpExtractText,
  type PptMcpHealth,
} from "@/lib/pptMcp/api";
import { isPptMcpServerAvailable } from "@/lib/pptMcp/config";
import { generateAiPowerpointDeck } from "@/lib/powerpoint/ai-deck";
import { PowerpointPresentation } from "@/lib/powerpoint/deck";
import { generatePptFromGenerator } from "@/lib/pptGenerator/generate";
import { PPT_GENERATOR_THEMES, type PptGeneratorThemeId } from "@/lib/pptGenerator/themes";
import { PPTXGEN_THEMES, type PptxGenThemeId } from "@/lib/pptxGenJS/themes";
import type { PptAiAssistantProps } from "@/lib/reactTypes/component-props";
import type { PptGenerationSource } from "@/lib/reactTypes/constants";
import { dispatchLoficeEvent } from "@/lib/reactTypes/events";
import { saveFileLocal } from "@/lib/storage/local";

export default function PptAiAssistant({
  buffer,
  fileName = "presentation.pptx",
  onDocumentCreated,
  className = "",
}: PptAiAssistantProps) {
  const [colorScheme, setColorScheme] = useState<PptColorSchemeId>("modern_blue");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [extracted, setExtracted] = useState<string | null>(null);
  const [health, setHealth] = useState<PptMcpHealth | null>(null);
  const [slideCount, setSlideCount] = useState(6);
  const [aiSource, setAiSource] = useState<PptGenerationSource | string>("");
  const [presentationTitle, setPresentationTitle] = useState("");
  const [presenterName, setPresenterName] = useState("lofice");
  const [generatorTheme, setGeneratorTheme] = useState<PptGeneratorThemeId>("classic");
  const [insertImage, setInsertImage] = useState(false);
  const [pptxGenTheme, setPptxGenTheme] = useState<PptxGenThemeId>("office_blue");
  const demoTableRef = useRef<HTMLTableElement>(null);
  const serverOn = isPptMcpServerAvailable();
  const hasDoc = Boolean(buffer?.byteLength);

  useEffect(() => {
    if (!serverOn) return;
    void checkPptMcpHealth().then(setHealth).catch(() => setHealth(null));
  }, [serverOn]);

  const saveAndNotify = useCallback(
    async (ab: ArrayBuffer, name: string, source: PptGenerationSource | string = "pptxgenjs") => {
      downloadPptx(ab, name);
      await saveFileLocal(new File([new Uint8Array(ab)], name));
      onDocumentCreated?.(ab, name);
      dispatchLoficeEvent("lofice:pptGenerated", { fileName: name, source });
      setMessage(`${name} 저장·다운로드 완료`);
      setAiSource(source);
    },
    [onDocumentCreated],
  );

  const runExtract = async () => {
    if (!buffer) return;
    setLoading(true);
    setMessage(null);
    try {
      const result = serverOn
        ? await pptMcpExtractText(buffer, fileName)
        : await extractPresentationTextClient(buffer);
      setExtracted(result.all_presentation_text_combined);
      setMessage(`텍스트 추출: ${result.total_slides}슬라이드 · ${result.slides_with_text}개 텍스트`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "추출 실패");
    } finally {
      setLoading(false);
    }
  };

  const runQuickSequence = async (seqId: string) => {
    const preset = PPT_QUICK_SEQUENCES.find((s) => s.id === seqId);
    if (!preset) return;
    setLoading(true);
    try {
      const ab = await createPresentationFromTemplates(preset.sequence, `${preset.id}.pptx`, colorScheme);
      await saveAndNotify(ab, `${preset.id}.pptx`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "생성 실패");
    } finally {
      setLoading(false);
    }
  };

  const runAutoGenerate = async () => {
    if (!topic.trim()) {
      setMessage("주제를 입력하세요.");
      return;
    }
    setLoading(true);
    setAiSource("");
    try {
      const { deck, source } = await generateAiPowerpointDeck({
        topic,
        slide_count: slideCount,
        color_scheme: colorScheme,
        language: "ko",
        author: "lofice",
      });
      const label = source === "ai" ? "powerpoint-gem" : "heuristic";
      const ab = await deck.save("lofice-ai.pptx");
      await saveAndNotify(ab, "lofice-ai.pptx", label);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "자동 생성 실패");
    } finally {
      setLoading(false);
    }
  };

  const runGenerator = async () => {
    if (!topic.trim()) {
      setMessage("내용/주제를 입력하세요.");
      return;
    }
    setLoading(true);
    setAiSource("");
    try {
      const { buffer, source } = await generatePptFromGenerator({
        user_text: topic,
        number_of_slide: slideCount,
        template_choice: generatorTheme,
        presentation_title: presentationTitle || topic.slice(0, 80),
        presenter_name: presenterName,
        insert_image: insertImage,
        language: "ko",
      });
      const label =
        source === "openai"
          ? "gpt-generator"
          : source === "builtin"
            ? "builtin"
            : "heuristic";
      await saveAndNotify(buffer, "lofice-generator.pptx", label);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Generator 생성 실패");
    } finally {
      setLoading(false);
    }
  };

  const runGemDemo = async () => {
    setLoading(true);
    try {
      const deck = new PowerpointPresentation();
      deck
        .addIntro("Bicycle Of the Mind", "created by Steve Jobs — powerpoint gem demo")
        .addTextualSlide("Why Mac?", ["Its cool!", "Its light."])
        .addTextualSlide("lofice", ["브라우저에서 PPT 생성", "Ruby gem API 이식"]);
      const ab = await deck.save("gem-demo.pptx");
      await saveAndNotify(ab, "gem-demo.pptx", "powerpoint-gem");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "데모 생성 실패");
    } finally {
      setLoading(false);
    }
  };

  const runPptxGenHello = async () => {
    setLoading(true);
    try {
      const { buildHelloWorldDemo } = await import("@/lib/pptxGenJS/builder");
      const ab = await buildHelloWorldDemo();
      await saveAndNotify(ab, "pptxgenjs-hello.pptx", "pptxgenjs");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "PptxGenJS 생성 실패");
    } finally {
      setLoading(false);
    }
  };

  const runPptxGenFeatures = async () => {
    setLoading(true);
    try {
      const { buildFeatureDemo } = await import("@/lib/pptxGenJS/builder");
      const ab = await buildFeatureDemo(topic.trim() || "lofice");
      await saveAndNotify(ab, "pptxgenjs-features.pptx", "pptxgenjs");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "PptxGenJS 기능 데모 실패");
    } finally {
      setLoading(false);
    }
  };

  const runPptxGenAiDeck = async () => {
    if (!topic.trim()) {
      setMessage("주제를 입력하세요.");
      return;
    }
    setLoading(true);
    try {
      const { buildAiTopicDeck } = await import("@/lib/pptxGenJS/builder");
      const ab = await buildAiTopicDeck(topic, slideCount);
      await saveAndNotify(ab, "pptxgenjs-ai.pptx", "pptxgenjs");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "PptxGenJS AI 덱 실패");
    } finally {
      setLoading(false);
    }
  };

  const runHtmlTablePptx = async () => {
    const table = demoTableRef.current;
    if (!table) {
      setMessage("샘플 테이블을 찾을 수 없습니다.");
      return;
    }
    setLoading(true);
    try {
      const { exportHtmlTableToPptx } = await import("@/lib/pptxGenJS/builder");
      const ab = await exportHtmlTableToPptx(table, topic.trim() || "HTML Table");
      await saveAndNotify(ab, "html-table.pptx", "pptxgenjs");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "HTML→PPT 변환 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Bot className="w-5 h-5 text-[#d24726]" />
        <h2 className="text-sm font-semibold text-gray-800">PPT AI (MCP)</h2>
        {serverOn && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700">
            API {health?.python_pptx ? "python-pptx" : "…"}
          </span>
        )}
      </div>

      <p className="text-[10px] text-gray-500 leading-relaxed">
        PptxGenJS + powerpoint gem + GPT Generator · 차트·테이블·HTML→PPT·AI 생성
      </p>

      <section className="border rounded-lg p-3 bg-blue-50/60 space-y-2">
        <p className="text-[10px] font-semibold text-[#2B579A]">PptxGenJS</p>
        <label className="block text-[10px] text-gray-600">
          내보내기 테마
          <select
            value={pptxGenTheme}
            onChange={(e) => setPptxGenTheme(e.target.value as PptxGenThemeId)}
            className="mt-1 w-full text-xs border rounded px-2 py-1.5"
          >
            {PPTXGEN_THEMES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => void runPptxGenHello()}
            className="py-2 text-[10px] border rounded-lg bg-white hover:border-[#2B579A]/50"
          >
            Hello World
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => void runPptxGenFeatures()}
            className="py-2 text-[10px] border rounded-lg bg-white hover:border-[#2B579A]/50"
          >
            차트·테이블·도형
          </button>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => void runPptxGenAiDeck()}
          className="w-full py-2 text-xs bg-[#2B579A] text-white rounded-lg disabled:opacity-50"
        >
          PptxGenJS AI 덱 생성
        </button>
        <table ref={demoTableRef} id="lofice-demo-table" className="w-full text-[10px] border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-2 py-1">분기</th>
              <th className="border border-gray-200 px-2 py-1">매출</th>
              <th className="border border-gray-200 px-2 py-1">성장</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="border px-2 py-1">Q1</td><td className="border px-2 py-1">120</td><td className="border px-2 py-1">+12%</td></tr>
            <tr><td className="border px-2 py-1">Q2</td><td className="border px-2 py-1">145</td><td className="border px-2 py-1">+18%</td></tr>
            <tr><td className="border px-2 py-1">Q3</td><td className="border px-2 py-1">162</td><td className="border px-2 py-1">+9%</td></tr>
          </tbody>
        </table>
        <button
          type="button"
          disabled={loading}
          onClick={() => void runHtmlTablePptx()}
          className="w-full py-2 text-[10px] border rounded-lg text-gray-700"
        >
          HTML table → PPT (tableToSlides)
        </button>
      </section>

      <label className="block text-[10px] text-gray-600">
        컬러 스킴
        <select
          value={colorScheme}
          onChange={(e) => setColorScheme(e.target.value as PptColorSchemeId)}
          className="mt-1 w-full text-xs border rounded px-2 py-1.5"
        >
          {PPT_COLOR_SCHEMES.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </label>

      <section className="border rounded-lg p-3 bg-orange-50/50 space-y-2">
        <p className="text-[10px] font-semibold text-[#d24726]">GPT Generator (Python Project)</p>
        <input
          value={presentationTitle}
          onChange={(e) => setPresentationTitle(e.target.value)}
          placeholder="프레젠테이션 제목 (비우면 주제 사용)"
          className="w-full text-xs border rounded px-2 py-1.5"
        />
        <input
          value={presenterName}
          onChange={(e) => setPresenterName(e.target.value)}
          placeholder="발표자 이름"
          className="w-full text-xs border rounded px-2 py-1.5"
        />
        <label className="block text-[10px] text-gray-600">
          테마
          <select
            value={generatorTheme}
            onChange={(e) => setGeneratorTheme(e.target.value as PptGeneratorThemeId)}
            className="mt-1 w-full text-xs border rounded px-2 py-1.5"
          >
            {PPT_GENERATOR_THEMES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-[10px] text-gray-600">
          <input
            type="checkbox"
            checked={insertImage}
            onChange={(e) => setInsertImage(e.target.checked)}
          />
          Pexels 이미지 삽입 (API: PEXELS_API_KEY)
        </label>
        <button
          type="button"
          disabled={loading}
          onClick={() => void runGenerator()}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#b7472a] text-white text-sm rounded-lg disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          GPT Generator로 PPT 생성
        </button>
      </section>

      {hasDoc && (
        <button
          type="button"
          disabled={loading}
          onClick={() => void runExtract()}
          className="w-full flex items-center justify-center gap-2 py-2 border rounded-lg text-xs"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
          extract_presentation_text
        </button>
      )}

      <section>
        <p className="text-[10px] font-medium text-gray-600 mb-2">빠른 템플릿 시퀀스</p>
        <div className="grid gap-2">
          {PPT_QUICK_SEQUENCES.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={loading}
              onClick={() => void runQuickSequence(p.id)}
              className="flex items-center gap-2 p-2 bg-white border rounded-lg text-left text-xs hover:border-[#d24726]/40"
            >
              <Presentation className="w-4 h-4 text-[#d24726] shrink-0" />
              {p.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="text-[10px] font-medium text-gray-600 mb-1">AI PPT 생성 (powerpoint gem)</p>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="예: 2026 AI 트렌드"
          className="w-full text-xs border rounded px-2 py-2 mb-2"
        />
        <label className="block text-[10px] text-gray-500 mb-2">
          슬라이드 수
          <input
            type="number"
            min={3}
            max={20}
            value={slideCount}
            onChange={(e) => setSlideCount(Number(e.target.value) || 6)}
            className="mt-1 w-full text-xs border rounded px-2 py-1"
          />
        </label>
        <button
          type="button"
          disabled={loading}
          onClick={() => void runAutoGenerate()}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#d24726] text-white text-sm rounded-lg disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          AI로 PPT 생성
        </button>
        {aiSource && <p className="text-[10px] text-gray-400 mt-1">엔진: {aiSource}</p>}
        {!serverOn && (
          <p className="text-[10px] text-gray-400 mt-1">
            API 미설정 시 powerpoint gem 휴리스틱으로 생성됩니다. OPENAI 연동: NEXT_PUBLIC_PPT_MCP_URL
          </p>
        )}
        <button
          type="button"
          disabled={loading}
          onClick={() => void runGemDemo()}
          className="w-full mt-2 py-2 text-xs border rounded-lg text-gray-600"
        >
          gem 데모 (Steve Jobs 슬라이드)
        </button>
      </section>

      <details className="text-[10px]">
        <summary className="cursor-pointer text-gray-500 flex items-center gap-1">
          <Wand2 className="w-3 h-3" /> {PPT_SLIDE_TEMPLATES.length}개 슬라이드 템플릿
        </summary>
        <ul className="mt-2 max-h-32 overflow-auto space-y-1 text-gray-600">
          {PPT_SLIDE_TEMPLATES.map((t) => (
            <li key={t.id}>{t.name} — {t.description}</li>
          ))}
        </ul>
      </details>

      {extracted && (
        <pre className="text-[9px] bg-gray-50 p-2 rounded max-h-40 overflow-auto whitespace-pre-wrap">{extracted}</pre>
      )}

      {message && <p className="text-xs p-2 rounded bg-gray-50 text-gray-700">{message}</p>}

      <button
        type="button"
        disabled={loading || !message?.includes("완료")}
        className="hidden"
      >
        <Download className="w-3 h-3" />
      </button>
    </div>
  );
}
