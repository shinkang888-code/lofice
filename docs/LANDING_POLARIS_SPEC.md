# Loffice Polaris-Style Landing v3 (v2.18.0)

## 개요

Polaris Office NOVA 랜딩을 참조하되 **Loffice Navy + Gold** 브랜드를 유지한 이미지·비주얼 중심 프론트 페이지.

## 섹션 구조

| 순서 | 컴포넌트 | 설명 |
|------|----------|------|
| 1 | `LofficePolarisHeader` | 로고, 내 문서, 네비, LanguagePicker, 로그인 CTA |
| 2 | `LofficePolarisHero` | AI 배지 오빗, Nova 타이틀, pill 검색+문서열기, 제안 칩 |
| 3 | `LofficePolarisIntegrations` | HWP·Office·PDF·AI 통합 로고 스트립 |
| 4 | 작업 시작 | Workspace + Nova + Quick 카드 (간격 축소) |
| 5 | `LofficePolarisFeatureBento` | 4열 벤토 — 변환·PPT AI·OCR·보안 AI |
| 6 | `LofficePolarisUseCases` | Use case + 페르소나 카드 |
| 7 | 인기 도구 | 기존 popular grid (polaris 카드 스타일) |
| 8 | `LofficeToolSection` ×4 | 문서·AI·변환·분석 |
| 9 | `LofficePolarisGlobal` | 다크 글로벌·통계·플랫폼 그리드 |
| 10 | `LofficePolarisNews` | 그라데이션 뉴스 2×2 |
| 11 | 업데이트 노트 | v2.18.0 포함 |
| 12 | `LofficePolarisCta` | 하단 CTA 배너 |
| 13 | `LofficePolarisFooter` | 언어선택·링크·저작권 |

## 디자인 토큰

- `.lo-polaris-hero` — 파스텔 그라데이션 + Navy/Gold 악센트
- `.lo-polaris-pill` — 히어로 검색 pill
- `.lo-polaris-card` — 호버 리프트 카드
- `.lo-polaris-global` — 다크 월드맵 느낌
- `.lo-polaris-news-card` — 딥 퍼플 그라데이션 뉴스 카드

## i18n

`messages.polaris.*` — ko/en 완전 번역, 기타 locale은 en 폴백.

## 검증

```bash
npm run build
```

프로덕션: `npx vercel --prod --yes`
