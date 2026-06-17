/** lofice-14291513 랜딩 — 도구 카드 + 실제 라우트 */

export type LofficeTool = {
  id: string;
  icon: string;
  name: string;
  desc: string;
  tags: string;
  href: string;
  category: "doc" | "convert" | "ai" | "analyze";
};

export const LOFFICE_DOC_TOOLS: LofficeTool[] = [
  { id: "pdfViewer", icon: "📄", name: "PDF 뷰어", desc: "고속 렌더링으로 대용량 PDF도 부드럽게 열람합니다.", tags: "#PDF #뷰어", href: "/viewer/", category: "doc" },
  { id: "pdfEdit", icon: "✏️", name: "PDF 편집", desc: "병합·분할·회전·페이지 추출 (Stirling-PDF 패턴).", tags: "#PDF #편집", href: "/pdf-editor/", category: "doc" },
  { id: "wordEditor", icon: "📝", name: "Word 편집기", desc: ".docx 문서를 브라우저에서 바로 작성·수정합니다.", tags: "#Word #DOCX", href: "/editor/", category: "doc" },
  { id: "excelEditor", icon: "📊", name: "Excel 편집기", desc: "수식과 셀 편집을 지원하는 스프레드시트.", tags: "#Excel #XLSX", href: "/editor/", category: "doc" },
  { id: "pptEditor", icon: "🎞️", name: "PowerPoint 편집기", desc: "슬라이드 편집·발표자 노트·PPTX 저장.", tags: "#PPT #슬라이드", href: "/ppt-editor/", category: "doc" },
  { id: "hwpViewer", icon: "한", name: "한글(HWP) 뷰어", desc: "HWP/HWPX WASM 뷰어·rhwp-studio 편집.", tags: "#HWP #뷰어", href: "/hwp-editor/", category: "doc" },
  { id: "pdfMergeSplit", icon: "🔀", name: "PDF 병합/분할", desc: "여러 파일을 하나로 합치거나 페이지별로 분할합니다.", tags: "#PDF #병합", href: "/pdf-editor/", category: "doc" },
  { id: "zipArchive", icon: "🗜️", name: "7-Zip 아카이브", desc: "zip/7z/rar 목록·추출·압축.", tags: "#압축 #아카이브", href: "/archive/", category: "doc" },
];

export const LOFFICE_CONVERT_TOOLS: LofficeTool[] = [
  { id: "loficePro", icon: "⚡", name: "lofice Pro", desc: "LibreOffice Pro 엔진 — 레거시·ODF·HWPX 고품질 변환.", tags: "#Pro #LibreOffice #변환", href: "/pro/", category: "convert" },
  { id: "docConvert", icon: "↔️", name: "문서 변환", desc: "Office Tool Plus 패턴 문서 변환 도구.", tags: "#변환", href: "/convert/", category: "convert" },
  { id: "pdfToExcel", icon: "📈", name: "PDF → Excel", desc: "표 구조 인식·시트 편집으로 이어집니다.", tags: "#변환 #PDF #Excel", href: "/convert/", category: "convert" },
  { id: "imageViewer", icon: "🖼️", name: "이미지 뷰어", desc: "PNG·JPG·GIF 등 이미지 문서 열람.", tags: "#이미지", href: "/viewer/", category: "convert" },
  { id: "hwpToPdf", icon: "🅷", name: "HWP → PDF", desc: "한글 문서 뷰어·보내기.", tags: "#변환 #HWP", href: "/hwp-editor/", category: "convert" },
  { id: "ocrExtract", icon: "🔡", name: "OCR 텍스트 추출", desc: "PDF·이미지에서 텍스트 추출 (ddddocr/Tesseract).", tags: "#OCR #텍스트", href: "/viewer/", category: "convert" },
  { id: "zipBundle", icon: "📦", name: "ZIP 문서 묶음", desc: "여러 문서를 한 번에 압축·공유.", tags: "#압축 #공유", href: "/archive/", category: "convert" },
];

export const LOFFICE_AI_TOOLS: LofficeTool[] = [
  { id: "pptAi", icon: "✨", name: "PPT AI 생성", desc: "GPT·PptxGenJS·powerpoint gem으로 PPT 자동 생성.", tags: "#AI #PPT", href: "/ppt-ai/", category: "ai" },
  { id: "hwpAi", icon: "🌐", name: "HWP AI", desc: "한글 문서 AI 보조 (hwpx skill).", tags: "#AI #HWP", href: "/hwp-ai/", category: "ai" },
  { id: "docChat", icon: "💬", name: "문서 기반 작업", desc: "뷰어에서 OCR·텍스트 추출 후 편집.", tags: "#AI #챗", href: "/files/", category: "ai" },
  { id: "gptPpt", icon: "🪄", name: "GPT Generator PPT", desc: "OpenAI + Pexels 이미지 슬라이드 생성.", tags: "#AI #작성", href: "/ppt-ai/", category: "ai" },
  { id: "pptTextExtract", icon: "🔍", name: "PPT 텍스트 추출", desc: "MCP 패턴 슬라이드 텍스트 추출.", tags: "#AI #분석", href: "/ppt-ai/", category: "ai" },
  { id: "officeCrypto", icon: "🔒", name: "Office 암·복호화", desc: "docx/xlsx/pptx 비밀번호 보호·복호화.", tags: "#보안", href: "/office-crypto/", category: "ai" },
];

export const LOFFICE_ANALYZE_TOOLS: LofficeTool[] = [
  { id: "docMetadata", icon: "ℹ️", name: "문서 메타데이터", desc: "파일 목록·형식·로컬 저장 정보.", tags: "#메타 #분석", href: "/files/", category: "analyze" },
  { id: "toolbox", icon: "🧱", name: "도구 상자", desc: "해시 체크·설정 I/O·Office Tool Plus.", tags: "#도구", href: "/toolbox/", category: "analyze" },
  { id: "officeMigrate", icon: "🛡️", name: "Office → lofice", desc: "MS Office 제거·lofice 마이그레이션 마법사.", tags: "#보안 #마이그레이션", href: "/migrate/", category: "analyze" },
];

export const ALL_LOFFICE_TOOLS: LofficeTool[] = [
  ...LOFFICE_DOC_TOOLS,
  ...LOFFICE_AI_TOOLS,
  ...LOFFICE_CONVERT_TOOLS,
  ...LOFFICE_ANALYZE_TOOLS,
];

export function filterTools(query: string, tools: LofficeTool[], labels?: (t: LofficeTool) => { name: string; desc: string; tags: string }): LofficeTool[] {
  const q = query.trim().toLowerCase();
  if (!q) return tools;
  return tools.filter((tool) => {
    const l = labels?.(tool) ?? { name: tool.name, desc: tool.desc, tags: tool.tags };
    return (
      l.name.toLowerCase().includes(q) ||
      l.desc.toLowerCase().includes(q) ||
      l.tags.toLowerCase().includes(q) ||
      tool.id.toLowerCase().includes(q)
    );
  });
}
