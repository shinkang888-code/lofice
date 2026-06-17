/** lofice-14291513 원본 네비·퀵카드 → lofice 라우트 */

export type NavItem = { label: string; href: string; external?: boolean };

export const LOFFICE_HEADER_NAV: NavItem[] = [
  { label: "문서편집", href: "/doc-edit/" },
  { label: "업데이트", href: "/updates/" },
  { label: "마이페이지", href: "/mypage/" },
];

export const LOFFICE_FOOTER_NAV: NavItem[] = [
  { label: "업데이트 노트", href: "/updates/" },
  { label: "마이페이지", href: "/mypage/" },
  { label: "설정", href: "/settings/" },
];

export const LOFFICE_AI = {
  href: "/files/",
  tags: [
    { label: "AI 채팅", href: "/hwp-ai/" },
    { label: "문서 작업", href: "/files/" },
    { label: "번역", href: "/convert/" },
  ],
} as const;

export const LOFFICE_QUICK_CARDS = [
  {
    tag: "보안 AI",
    title: "나만의 보안 AI 채팅",
    icon: "💬",
    desc: "서버 업로드 없이 내 브라우저에서 안전하게 실행되는 AI 채팅.",
    cta: "보안 AI 채팅",
    href: "/hwp-ai/",
  },
  {
    tag: "AI 요약",
    title: "AI 문서 요약",
    icon: "✨",
    desc: "긴 보고서·논문을 한 화면 요약으로 빠르게 파악합니다.",
    cta: "AI 요약",
    href: "/viewer/",
  },
  {
    tag: "변환",
    title: "PDF ↔ Word 변환",
    icon: "↔️",
    desc: "서식을 유지하며 PDF와 Word를 양방향으로 변환합니다.",
    cta: "변환 도구",
    href: "/convert/",
  },
] as const;

export const LOFFICE_UPDATES = [
  { version: "v2.16.0", date: "2026-06", text: "랜딩 UI v2 — 검색+문서열기 인라인, Lucide 아이콘, 인기 도구, 간격·타이포 개선" },
  { version: "v2.12.0", date: "2026-06", text: "lofice-14291513 랜딩 UI를 메인 홈에 연동 · 파일 열기·도구 검색·퀵카드 라우트 연결" },
  { version: "v2.11.0", date: "2026-06", text: "TypeScript React typed CustomEvent · v2.4–v2.11 오픈소스 통합" },
  { version: "v2.10.0", date: "2026-06", text: "PptxGenJS 브라우저 PPT 생성 · 차트·테이블·HTML→PPT" },
  { version: "v2.7.0", date: "2026-06", text: "PPT AI · GPT Generator · MCP 텍스트 추출" },
] as const;

export const LOFFICE_BLOG_POSTS = [
  { title: "브라우저만으로 HWP·PDF·Office 편집하기", href: "/hwp-editor/", tag: "가이드" },
  { title: "PPT AI로 슬라이드 자동 생성", href: "/ppt-ai/", tag: "AI" },
  { title: "Office Tool Plus 패턴 도구 상자", href: "/toolbox/", tag: "도구" },
  { title: "PDF 병합·분할·회전 (Stirling-PDF)", href: "/pdf-editor/", tag: "PDF" },
] as const;
