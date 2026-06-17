/** 릴리스 노트 — /updates 전용 */

export type ReleaseNote = {
  version: string;
  date: string;
  messageKey: string;
  fallback: string;
};

export const LOFFICE_RELEASE_NOTES: ReleaseNote[] = [
  {
    version: "v2.25.0",
    date: "2026-06",
    messageKey: "updates.v225",
    fallback:
      "Hancom 설치폴더 분석 기반 HWP 업그레이드 — HWPML 메타데이터·패키지 검증·문서 정보 패널",
  },
  {
    version: "v2.22.0",
    date: "2026-06",
    messageKey: "updates.v222",
    fallback: "LOFFICE AI 랜딩 — Gemini AI 채팅, Google 로그인, 마이페이지, 업데이트 전용 페이지",
  },
  {
    version: "v2.21.0",
    date: "2026-06",
    messageKey: "updates.v221",
    fallback: "HWP+MS Office 파이프라인 Phase 0–3 — 정규화·암호화·Excel·Outlook",
  },
  {
    version: "v2.19.0",
    date: "2026-06",
    messageKey: "updates.v219",
    fallback: "모바일 UI — Apple 스타일 검색·열기·미리보기 시트",
  },
  {
    version: "v2.18.0",
    date: "2026-06",
    messageKey: "updates.v218",
    fallback: "Polaris 스타일 랜딩 v3 — 이미지 중심 벤토·글로벌·뉴스 섹션",
  },
  {
    version: "v2.17.0",
    date: "2026-06",
    messageKey: "updates.v217",
    fallback: "글로벌 i18n — 90+ 언어·국가 검색 선택",
  },
  {
    version: "v2.16.0",
    date: "2026-06",
    messageKey: "updates.v216",
    fallback: "랜딩 UI v2 — 검색+문서열기 인라인, Lucide 아이콘",
  },
  {
    version: "v2.12.0",
    date: "2026-06",
    messageKey: "updates.v212",
    fallback: "lofice-14291513 랜딩 UI를 메인 홈에 연동",
  },
  {
    version: "v2.11.0",
    date: "2026-06",
    messageKey: "updates.v211",
    fallback: "TypeScript React typed CustomEvent · v2.4–v2.11 오픈소스 통합",
  },
];
