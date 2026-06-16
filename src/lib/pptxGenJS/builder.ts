/**
 * PptxGenJS 슬라이드 빌더 — lofice PptxSlide / AI deck 변환
 */
import type { PptxSlide } from "@/lib/parsers/pptx";
import { createPresentation, writePresentationArrayBuffer } from "@/lib/pptxGenJS/client";
import { getPptxGenTheme, type PptxGenThemeId } from "@/lib/pptxGenJS/themes";

function htmlToLines(html: string): string[] {
  if (typeof document === "undefined") {
    return html.replace(/<[^>]+>/g, "\n").split("\n").map((s) => s.trim()).filter(Boolean);
  }
  const div = document.createElement("div");
  div.innerHTML = html;
  const lines: string[] = [];
  div.querySelectorAll("p, li").forEach((el) => {
    const t = el.textContent?.trim();
    if (t) lines.push(t);
  });
  if (!lines.length) {
    const t = div.textContent?.trim();
    if (t) lines.push(t);
  }
  return lines;
}

export async function exportSlidesWithPptxGenJS(
  slides: PptxSlide[],
  _fileName: string,
  themeId: PptxGenThemeId = "office_blue",
): Promise<ArrayBuffer> {
  const theme = getPptxGenTheme(themeId);
  const pres = await createPresentation();
  pres.title = slides[0]?.title ?? "lofice presentation";

  for (const s of slides) {
    const slide = pres.addSlide({ masterName: undefined });
    if (theme.bgColor !== "FFFFFF") {
      slide.background = { color: theme.bgColor };
    }
    slide.addText(s.title, {
      x: 0.5,
      y: 0.35,
      w: 9,
      h: 0.8,
      fontSize: 28,
      bold: true,
      color: theme.titleColor,
      fontFace: "Arial",
    });

    const lines = htmlToLines(s.html);
    const hasImage = Boolean(s.imageUrls?.[0]);
    const bodyW = hasImage ? 4.5 : 9;

    if (lines.length) {
      slide.addText(
        lines.map((text) => ({ text, options: { bullet: lines.length > 1, breakLine: true } })),
        { x: 0.5, y: 1.4, w: bodyW, h: 4.5, fontSize: 16, color: theme.bodyColor, valign: "top" },
      );
    }

    if (s.imageUrls?.[0]) {
      slide.addImage({
        path: s.imageUrls[0],
        x: 5.2,
        y: 1.4,
        w: 4.3,
        h: 3.2,
        sizing: { type: "contain", w: 4.3, h: 3.2 },
      });
    }

    if (s.notes) {
      slide.addNotes(s.notes);
    }
  }

  return writePresentationArrayBuffer(pres);
}

/** 공식 Hello World 데모 */
export async function buildHelloWorldDemo(): Promise<ArrayBuffer> {
  const pres = await createPresentation();
  const slide = pres.addSlide();
  slide.addText("Hello World from PptxGenJS!", {
    x: 1,
    y: 1,
    w: 8,
    h: 1,
    color: "363636",
    fontSize: 24,
  });
  slide.addText("lofice · JavaScript PPT 생성", {
    x: 1,
    y: 2,
    w: 8,
    h: 0.6,
    color: "5B8DEF",
    fontSize: 14,
  });
  return writePresentationArrayBuffer(pres);
}

/** 차트 + 테이블 기능 데모 */
export async function buildFeatureDemo(topic = "lofice"): Promise<ArrayBuffer> {
  const pres = await createPresentation();
  pres.title = `${topic} — PptxGenJS`;

  const titleSlide = pres.addSlide();
  titleSlide.addText(topic, { x: 0.8, y: 2, w: 8.5, h: 1.2, fontSize: 36, bold: true, color: "2B579A" });
  titleSlide.addText("PptxGenJS charts · tables · shapes", { x: 0.8, y: 3.2, w: 8, h: 0.6, fontSize: 16, color: "666666" });

  const chartSlide = pres.addSlide();
  chartSlide.addText("성장 추이 (bar chart)", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 20, bold: true, color: "2B579A" });
  chartSlide.addChart(pres.ChartType.bar, [
    { name: "2024", labels: ["Q1", "Q2", "Q3", "Q4"], values: [20, 35, 45, 60] },
    { name: "2025", labels: ["Q1", "Q2", "Q3", "Q4"], values: [30, 42, 55, 72] },
  ], { x: 0.5, y: 1.1, w: 9, h: 4.5, showLegend: true, legendPos: "b" });

  const tableSlide = pres.addSlide();
  tableSlide.addText("핵심 지표 (table)", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 20, bold: true, color: "2B579A" });
  tableSlide.addTable(
    [
      [{ text: "항목", options: { bold: true, fill: { color: "2B579A" }, color: "FFFFFF" } }, { text: "값", options: { bold: true, fill: { color: "2B579A" }, color: "FFFFFF" } }],
      [{ text: "사용자" }, { text: "12,400" }],
      [{ text: "문서" }, { text: "89,200" }],
      [{ text: "PPT 생성" }, { text: "3,150" }],
    ],
    { x: 0.8, y: 1.2, w: 8.4, colW: [4, 4], border: { type: "solid", color: "CCCCCC", pt: 1 }, fontSize: 14 },
  );

  const shapeSlide = pres.addSlide();
  shapeSlide.addText("도형 · 텍스트", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 20, bold: true, color: "2B579A" });
  shapeSlide.addShape(pres.ShapeType.roundRect, {
    x: 0.8,
    y: 1.2,
    w: 3.5,
    h: 2,
    fill: { color: "5B8DEF" },
    line: { color: "2B579A", width: 1 },
  });
  shapeSlide.addText("PptxGenJS\nshapes", { x: 1, y: 1.6, w: 3, h: 1.2, color: "FFFFFF", fontSize: 16, align: "center" });

  return writePresentationArrayBuffer(pres);
}

/** HTML table ID → 슬라이드 (tableToSlides) */
export async function exportHtmlTableToPptx(tableEl: HTMLTableElement, title?: string): Promise<ArrayBuffer> {
  if (!tableEl.id) tableEl.id = `lofice-ppt-table-${Date.now()}`;
  const pres = await createPresentation();
  if (title) pres.title = title;
  pres.tableToSlides(tableEl.id, { x: 0.5, y: 0.5, w: 9, autoPage: true, autoPageSlideStartY: 0.5 });
  return writePresentationArrayBuffer(pres);
}

/** AI 주제 → PptxGenJS 풀 덱 (intro + bullets + chart) */
export async function buildAiTopicDeck(topic: string, slideCount = 5): Promise<ArrayBuffer> {
  const pres = await createPresentation();
  pres.title = topic;

  const intro = pres.addSlide();
  intro.addText(topic, { x: 0.8, y: 2, w: 8.5, h: 1, fontSize: 32, bold: true, color: "2B579A" });
  intro.addText("lofice · PptxGenJS AI", { x: 0.8, y: 3.1, w: 8, h: 0.5, fontSize: 14, color: "888888" });

  const sections = Math.max(1, slideCount - 2);
  for (let i = 0; i < sections; i++) {
    const slide = pres.addSlide();
    slide.addText(`${topic} — ${i + 1}`, { x: 0.5, y: 0.35, w: 9, h: 0.7, fontSize: 22, bold: true, color: "2B579A" });
    slide.addText(
      [
        { text: `${topic} 핵심 포인트 ${i + 1}`, options: { bullet: true, breakLine: true } },
        { text: "PptxGenJS로 생성된 슬라이드", options: { bullet: true, breakLine: true } },
        { text: "차트·테이블·이미지 지원", options: { bullet: true } },
      ],
      { x: 0.5, y: 1.3, w: 9, h: 4, fontSize: 16, color: "363636" },
    );
  }

  const chart = pres.addSlide();
  chart.addText("요약", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 20, bold: true, color: "2B579A" });
  chart.addChart(pres.ChartType.doughnut, [
    { name: "Share", labels: ["A", "B", "C"], values: [40, 35, 25] },
  ], { x: 2.5, y: 1.2, w: 5, h: 4, showLegend: true });

  return writePresentationArrayBuffer(pres);
}
