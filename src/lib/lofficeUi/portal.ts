/** 포털 릴리스 노트 (업데이트 페이지 전용) */

export type ReleaseNote = {
  version: string;
  date: string;
  title: string;
  items: string[];
};

export const LOFFICE_RELEASE_NOTES: ReleaseNote[] = [
  {
    version: "v2.19.0",
    date: "2026-06",
    title: "모바일 UI 개선",
    items: [
      "Apple 스타일 검색·열기·미리보기 시트",
      "뷰어·편집 크롬 컴팩트 레이아웃",
    ],
  },
  {
    version: "v2.18.0",
    date: "2026-06",
    title: "Polaris 랜딩 v3",
    items: ["이미지 중심 벤토 레이아웃", "글로벌 뉴스 섹션", "Navy+Gold 브랜드"],
  },
  {
    version: "v2.16.0",
    date: "2026-06",
    title: "랜딩 UI v2",
    items: ["인라인 검색+문서 열기", "Lucide 아이콘", "인기 도구·간격·타이포 개선"],
  },
  {
    version: "v2.13.0",
    date: "2026-06",
    title: "Loffice AI Studio 연동",
    items: ["Gemini PPT·문서 생성 Studio", "오피스 툴즈 허브 분리", "메뉴별 전용 페이지"],
  },
];

export type BlogPost = {
  title: string;
  href: string;
  tag: string;
  excerpt: string;
  readMin: number;
};

export const LOFFICE_BLOG_POSTS: BlogPost[] = [
  {
    title: "브라우저만으로 HWP·PDF·Office 편집하기",
    href: "/hwp-editor/",
    tag: "가이드",
    excerpt: "설치 없이 한글·PDF·워드를 열고 저장하는 방법을 단계별로 안내합니다.",
    readMin: 5,
  },
  {
    title: "PPT AI로 슬라이드 자동 생성",
    href: "/ppt-ai/",
    tag: "AI",
    excerpt: "프롬프트 한 줄로 발표 자료 초안을 만드는 PPT AI 사용법.",
    readMin: 4,
  },
  {
    title: "Office Tool Plus 패턴 도구 상자",
    href: "/toolbox/",
    tag: "도구",
    excerpt: "해시 검증·설정 I/O·Office Tool Plus 스타일 유틸리티.",
    readMin: 3,
  },
  {
    title: "PDF 병합·분할·회전",
    href: "/pdf-editor/",
    tag: "PDF",
    excerpt: "Stirling-PDF 패턴으로 PDF를 브라우저에서 바로 가공합니다.",
    readMin: 4,
  },
];

export const PORTAL_NAV = [
  { id: "docs" as const, label: "내 문서", href: "/files/" },
  { id: "tools" as const, label: "오피스 툴즈", href: "/office-tools/" },
  { id: "updates" as const, label: "업데이트", href: "/updates/" },
  { id: "blog" as const, label: "블로그", href: "/blog/" },
];

export type PortalNavId = (typeof PORTAL_NAV)[number]["id"];
