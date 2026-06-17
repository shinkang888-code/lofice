# Loffice Mobile UI (v2.19.0)

## 목표

데스크톱 UI를 기반으로 **검색·열기·미리보기·뷰어·편집** 핵심 기능만 모바일에 최적화. Apple 스타일의 심플·세련된 인터페이스.

## 브레이크포인트

- `max-width: 767px` — 모바일 (`useIsMobile`, Tailwind `md` 미만)
- `768px+` — 기존 데스크톱 리본 UI 유지

## 컴포넌트

| 파일 | 역할 |
|------|------|
| `hooks/useMediaQuery.ts` | 모바일 감지 |
| `mobile/MobileDocChrome.tsx` | 뷰어/에디터 상단·하단·메뉴 시트 |
| `mobile/MobileViewerSplit.tsx` | OCR/AI 패널 — 모바일 세그먼트 탭 |
| `mobile/MobilePreviewSheet.tsx` | 내 문서 풀스크린 미리보기 |

## 변경 요약

- **LoficeLayout**: 모바일에서 리본 숨김 → frosted glass 상단바 + 하단 액션바
- **viewer/preview**: 문서+패널 좌우 분할 → 모바일 탭 전환
- **FileList**: 모바일 풀스크린 미리보기 시트
- **documentPreview**: 모바일은 같은 탭 `/preview/` 이동
- **LofficeHeroSearch**: 모바일 열기 카드, 44px+ 터치 타깃
- **BottomNav**: blur 글래스 스타일

## 검증

```bash
npm run build
```

브라우저 DevTools → iPhone 14 Pro 등으로 `/`, `/files/`, `/viewer/` 확인.
