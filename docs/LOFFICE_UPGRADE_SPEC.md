# lofice v2.14+ 업그레이드 설계 · 확장개발명세서

## 1. 배경 및 목표

사용자 보고 이슈 (v2.13.0 기준):

| # | 증상 | 근본 원인 |
|---|------|-----------|
| 1 | PPT가 텍스트만 표시 | `parsePptx` HTML 추출만 사용, `MicroscopePptxViewer` 미우선 |
| 2 | OCR `detached ArrayBuffer` | pdfjs가 buffer detach 후 동일 buffer 재사용 |
| 3 | 리본 편집 버튼 비활성 | `ViewerToolbarContext`에 copy/print 미등록 |
| 4 | HWP 편집기 열기 실패 | cross-origin iframe `showOpenFilePicker` 차단 |

**목표:** HWP · PPT · PDF · 이미지를 브라우저에서 고품질 처리하고, 한컴·Microsoft·오픈소스 리포 패턴을 최대 이식.

---

## 2. GitHub 리포 분석 매트릭스

### 2.1 한글·문서 (한컴 / HWP)

| 리포 | 이식 대상 | lofice 경로 | 우선순위 |
|------|-----------|-------------|----------|
| [hwpreader](https://github.com/shinkang888-code/hwpreader) | rhwp WASM 뷰어·rhwp-studio 편집 | `@rhwp/core`, `@rhwp/editor`, `public/rhwp-studio/` | P0 |
| [hwpx-skill](https://github.com/shinkang888-code/hwpx-skill) | HWPX AI 생성·템플릿 | `/hwp-ai/`, `src/lib/hwpx/` | P1 |
| [HANCOM](https://github.com/shinkang888-code/HANCOM) | 한컴오피스 설치 구조·리본 패턴 | `src/lib/officeTool/`, UI 토큰 | P2 |

### 2.2 Microsoft / Office Open XML

| 리포 | 이식 대상 | lofice 경로 | 우선순위 |
|------|-----------|-------------|----------|
| [microscope-js](https://github.com/shinkang888-code/microscope-js) | PPTX/DOCX/XLSX 네이티브 렌더 | `MicroscopePptxViewer`, `MicroscopeOfficeViewer` | P0 |
| [DocX](https://github.com/shinkang888-code/DocX) | DOCX 서버 변환 참고 | `services/` (선택) | P2 |
| [markitdown](https://github.com/shinkang888-code/markitdown) | 문서→Markdown 변환 | `/convert/` | P2 |
| [office-docs-powershell](https://github.com/shinkang888-code/office-docs-powershell) | Office 자동화 패턴 | `/toolbox/` | P3 |

### 2.3 PPT · AI 슬라이드

| 리포 | 이식 대상 | lofice 경로 | 우선순위 |
|------|-----------|-------------|----------|
| [ppt-master](https://github.com/shinkang888-code/ppt-master) | SVG 슬라이드·발표자 노트·갤러리 | `PptMasterViewer`, `/ppt-ai/` | P0 |
| [PptxGenJS](https://github.com/shinkang888-code/PptxGenJS) | 브라우저 PPTX 생성 | `src/lib/pptxGenJS/` | P0 |
| powerpoint gem / GPT Generator | AI 덱 생성 | `src/lib/powerpoint/`, `ppt_generator.py` | P1 |

### 2.4 PDF · 이미지 · OCR

| 리포 | 이식 대상 | lofice 경로 | 우선순위 |
|------|-----------|-------------|----------|
| [Stirling-PDF](https://github.com/shinkang888-code/Stirling-PDF) | 병합·분할·회전 | `/pdf-editor/` | P0 |
| [docmentis-udoc-viewer](https://github.com/docMentis/docmentis-udoc-viewer) | WASM 고속 PDF/DOCX | `UDocViewerWrapper` | P0 |
| lawygo / LawyGo | ddddocr + Tesseract OCR | `src/lib/documentOcr/` | P0 |
| pdfjs-dist | PDF 텍스트·썸네일 | `src/lib/pdf/` | P0 |

### 2.5 인프라·도구

| 리포 | 이식 대상 | lofice 경로 |
|------|-----------|-------------|
| Office-Tool / msoffice-removal-tool | 도구상자·마이그레이션 | `/toolbox/`, `/migrate/` |
| lofice-14291513 | 랜딩 UI | `LofficeLandingPage` |

---

## 3. 아키텍처 (v2.14 목표)

```
[랜딩] → openLocalDocument → IndexedDB
                ↓
    ┌───────────┼───────────┐
    ▼           ▼           ▼
  PDF         HWP/PPT      이미지
 UDoc/pdfjs  rhwp/       ImageViewer
             microscope   + OCR
                ↓
         LoficeLayout 리본
    (ViewerToolbarContext + 기본 clipboard)
```

### 3.1 문서 라우팅

| 형식 | 1순위 뷰어 | 2순위 | 편집기 |
|------|-----------|-------|--------|
| PDF | UDoc WASM | pdfjs | `/pdf-editor/` |
| PPTX | microscope-js | PptMaster (텍스트·노트) | `/ppt-editor/` |
| HWP/HWPX | @rhwp/core Canvas | hwpxjs HTML | `/hwp-editor/` (rhwp-studio) |
| DOCX | UDoc / microscope | HTML | `/editor/` eigenpal |
| XLSX | microscope / xlsx parser | — | `/editor/` |
| 이미지 | ImageViewer | — | OCR 패널 |

### 3.2 버퍼 수명 정책

- IndexedDB 로드 직후 `cloneArrayBuffer()`로 작업 복제
- pdfjs·Worker·OCR 각각 독립 buffer 사용
- `postMessage` 전 `slice(0)` 필수

---

## 4. v2.14.0 구현 범위 (이번 스프린트)

### 4.1 버그 수정 (P0)

- [x] OCR detached ArrayBuffer — `cloneArrayBuffer` 전 구간 적용
- [x] PPT microscope-js 우선 렌더 + 텍스트 뷰 토글
- [x] 리본 copy/print/download 기본 동작
- [x] HWP 편집기: 로피스 리본 열기 + 안내 배너 (iframe showOpenFilePicker 제한)

### 4.2 v2.15 예정 (P1)

- ppt-editor에 microscope 미리보기 탭
- HWP rhwp iframe `postMessage` 파일 열기 브리지
- PDF 리본: 주석·하이라이트 (Stirling-PDF 연동)
- ddddocr Vercel Serverless 배포

### 4.3 v2.16 예정 (P2)

- markitdown 변환 파이프라인
- HANCOM 리본 XML → Tailwind 토큰 자동 매핑
- huashu-design HTML 슬라이드 → PPTX보내기

---

## 5. 검증 체크리스트

```bash
node scripts/test-pdf-open.mjs [pdf-path]
node scripts/verify-integrations.mjs
npm run build
```

| 시나리오 | 기대 결과 |
|----------|-----------|
| PPTX 열기 | microscope 슬라이드 레이아웃·이미지 표시 |
| 스캔 PDF OCR | detached 오류 없음, 텍스트 추출 |
| PDF 뷰어 홈 탭 | 복사(선택)·인쇄·다운로드 동작 |
| HWP 편집기 파일 열기 | 로피스 리본 → 파일 → 열기 |

---

## 6. 배포

- Vercel static export
- `postinstall`: WASM·pptxgen 복사
- HWP: `NEXT_PUBLIC_RHWP_STUDIO_URL` (선택, 기본 edwardkim.github.io/rhwp)

---

*작성: lofice v2.14.0 · shinkang888-code 오픈소스 통합*
