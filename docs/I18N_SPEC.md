# Loffice 글로벌 i18n 명세 (v2.17.0)

## 개요

90개 이상의 국가·언어를 검색형 Language 피커에서 선택하면 랜딩 UI 텍스트가 해당 언어로 표시됩니다.

## 구조

| 경로 | 역할 |
|------|------|
| `src/i18n/I18nProvider.tsx` | Context·localStorage·`document.lang`/`dir` |
| `src/i18n/locales.ts` | 90+ LocaleDefinition (검색어 포함) |
| `src/i18n/messages/ko.ts` | 한국어 전체 메시지 |
| `src/i18n/messages/en.ts` | 영어 전체 + 폴백 |
| `src/i18n/messages/*.ts` | 33개 UI 번역 팩 (en 병합) |
| `src/components/i18n/LanguagePicker.tsx` | 검색·스크롤·키보드 선택 UI |

## Language 피커 UX

1. 우상단 **Language** 버튼 클릭
2. 나라/언어 이름 입력 (예: `korea`, `日本`, `france`)
3. 스크롤 목록에서 선택 또는 Enter로 첫 항목 적용
4. ↑↓ 키로 이동

## 메시지 팩

- **완전 번역:** ko, en
- **UI 번역 33종:** ja, zh-CN, zh-TW, es, fr, de, pt, ru, ar, hi, vi, th, id, it, tr, nl, pl, uk, sv, da, fi, no, cs, ro, hu, el, he, ms, bn, fa, ur, sw, fil
- **기타 locale:** messageLocale 매핑 → 가장 가까운 팩, 없으면 en

## 검증

```bash
node scripts/verify-i18n.mjs
npm run build
```

## 확장

`scripts/generate-i18n-packs.mjs`의 `UI` 객체에 언어 추가 후 `npm run build` 실행.
