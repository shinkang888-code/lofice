# lofice (로피스)

광고 없는 무료 문서 뷰어 & 오피스. HWPX, DOCX, XLSX, PDF, 이미지 등 다형식 지원.

**웹:** https://lofice-one.vercel.app · https://lawbox-one.vercel.app

## 기능

- **뷰어**: HWPX, DOCX, XLSX, PDF, PPTX, ODT, TXT, 이미지, MD, HTML, JSON 등 (60+ 형식)
- **고속 WASM 뷰어**: @docmentis/udoc-viewer — PDF/DOCX 네이티브 렌더 (폴백: pdfjs / microscope-js)
- **고속 PDF**: pdfjs 워커 프리로드 + 1페이지 우선 렌더링 (UDoc 폴백)
- **HWP/HWPX**: @rhwp/core WASM Canvas 멀티페이지 뷰어 + @rhwp/editor rhwp-studio 편집 (hwpreader, v1.9.0)
- **7-Zip 아카이브**: 7z/zip/rar/tar 등 목록·추출·압축·테스트 (7z-wasm, v2.3.0)
- **Office Tool Plus 패턴**: 도구 상자·문서 변환·해시 체크·테마·설정 I/O (v2.4.0)
- **Office 암·복호화 (msoffice)**: docx/xlsx/pptx 비밀번호 보호·뷰어 자동 복호화 (v2.5.0)
- **Office → lofice 마이그레이션**: msoffice-removal-tool 패턴 · 단계별 전환 (v2.6.0)
- **PPT AI (PowerPoint MCP)**: 템플릿·텍스트 추출·AI 자동 생성 (v2.7.0)
- **PPT AI (powerpoint gem)**: Ruby gem API 이식 · add_intro / add_textual_slide · AI outline (v2.8.0)
- **PPT AI (GPT Generator)**: GPT 슬라이드·키워드·Pexels·테마 (v2.9.0)
- **PPT (PptxGenJS)**: 차트·테이블·도형·HTML→PPT·브라우저 네이티브 생성 (v2.10.0)
- **TypeScript React 패턴**: typed CustomEvent · string literal · Props 타입 (v2.11.0)
- **HWP/HWPX (폴백)**: hwpxjs HTML 뷰어
- **DOCX 편집**: @eigenpal/docx-editor-react 1.x WYSIWYG (실제 DOCX 저장)
- **한글 편집**: TipTap + 폴라리스 스타일 페이지 레이아웃, 리본 연동
- **시트 편집**: 수식 입력줄(fx), A1 셀 참조, 시트 탭, 키보드 탐색
- **OCR 텍스트 추출**: PDF 텍스트 레이어 → ddddocr / Tesseract OCR (LawyGo 패턴, v2.1.0)
- **PDF 편집 (Stirling-PDF)**: 병합·분할·회전·추출·삭제·순서 변경 (pdf-lib, v1.8.0)
- **PPT/PPTX (ppt-master)**: 갤러리 뷰어·발표자 노트·슬라이드 편집·PPTX 저장 (v2.0.0)
- **미리보기**: 파일 목록 인라인 패널 + 새 창 미리보기 (`/preview`)
- **광고 없음**: 추적·광고·텔레메트리 코드 없음
- **오프라인**: IndexedDB 로컬 저장
- **안드로이드**: Capacitor 네이티브 앱
- **Windows**: Electron 설치 프로그램 (.exe)

## LawyGo에서 이식 (v1.7.0)

| LawyGo | lofice | 비고 |
|--------|--------|------|
| `/api/document/ocr` | `extractDocumentTextClient` | static export → ddddocr API + Tesseract.js 폴백 |
| `PdfCanvasViewer` | `DocumentViewer` + UDoc/PdfViewer | 기존 뷰어 활용 |
| `DocumentPreviewPanel` | `components/preview/DocumentPreviewPanel` | IndexedDB 연동 |
| `PreviewButton` | `components/preview/PreviewButton` | 파일 목록 미리보기 |
| `pdfPreview.ts` | `lib/preview/documentPreview.ts` | `/preview` 새 창 |

## Stirling-PDF에서 이식 (v1.8.0)

[Stirling-PDF](https://github.com/Stirling-Tools/Stirling-PDF) 핵심 PDF 도구를 **클라이언트(pdf-lib)** 로 이식. Java 서버 없이 static export에서 동작.

| Stirling API | lofice | 비고 |
|--------------|--------|------|
| `/api/v1/general/merge-pdfs` | `stirlingMergePdfs` | pdf-lib + 선택적 서버 API |
| `/api/v1/general/rotate-pdf` | `stirlingRotatePdf` | 90° 단위 회전 |
| `/api/v1/general/split-pages` | `stirlingSplitPages` | 페이지별 ZIP 분할 |
| Viewer workbench | `PdfEditorPanel` + `PdfViewer` | 썸네일·페이지 선택 UI |
| Full Stirling UI | `StirlingPdfEmbed` | `NEXT_PUBLIC_STIRLING_PDF_URL` 설정 시 iframe |

```bash
# 선택: Stirling-PDF Docker 서버 연동
NEXT_PUBLIC_STIRLING_PDF_URL=http://localhost:8080
```

PDF 뷰어 → **보기** 탭 **PDF 편집** 또는 `/pdf-editor/?id=...`

## hwpreader에서 이식 (v1.9.0)

[hwpreader](https://github.com/shinkang888-code/hwpreader) (rhwp fork) HWP/HWPX 뷰어·편집기 전체 기능 통합.

| hwpreader | lofice | 비고 |
|-----------|--------|------|
| `@rhwp/core` Canvas 뷰어 | `RhwpCanvasViewer` | 멀티페이지 스크롤·줌·페이지 이동 |
| `@rhwp/editor` rhwp-studio | `RhwpEditor` | 메뉴·툴바·표·수식·서식·Undo/Redo |
| hwpctl 30 Actions | rhwp-studio 내장 | iframe postMessage API |
| exportHwp / exportHwpx | `RhwpEditor.save()` | HWP/HWPX 네이티브 저장 |
| rhwp-studio 셀프호스팅 | `NEXT_PUBLIC_RHWP_STUDIO_URL` | 기본: edwardkim.github.io/rhwp |

HWP 뷰어 → **보기** 탭 **HWP 편집** 또는 `/hwp-editor/?id=...`

## ppt-master에서 이식 (v2.0.0)

[ppt-master](https://github.com/shinkang888-code/ppt-master) PPT/PPTX 뷰어·편집기 통합.

| ppt-master | lofice | 비고 |
|------------|--------|------|
| `viewer.html` 갤러리 | `PptMasterViewer` | 극장·전체화면·썸네일·키보드·스와이프 |
| Speaker notes | `PptxSlide.notes` + 노트 패널 | PPTX notesSlide 파싱 |
| SVG 슬라이드 | `slide.svg` + `<object>` | PPT Master svg_output |
| 슬라이드 편집 | `PptSlideEditor` | 제목·본문·노트 |
| PPTX 내보내기 | `exportSlidesToPptx` (JSZip) | 네이티브 편집 가능 PPTX |
| 온라인 갤러리 | `PptMasterEmbed` | `/ppt-editor/?mode=gallery` |
| `@microscope-js/renderer-pptx` | `MicroscopePptxViewer` | 텍스트 뷰 폴백 |

PPT 뷰어 → **보기** 탭 **PPT 편집** 또는 `/ppt-editor/?id=...`

PPT Master 예제 갤러리: `/ppt-editor/?mode=gallery&project=ppt169_pritzker_2026`

## ddddocr에서 이식 (v2.1.0)

[ddddocr](https://github.com/shinkang888-code/ddddocr) 범용 캡차·문자 OCR을 **선택적 API 서버**로 연동. static export 환경에서는 브라우저에서 Tesseract.js 폴백.

| ddddocr | lofice | 비고 |
|---------|--------|------|
| `classification()` | `ddddocrClassifyBuffer` | 이미지·캡차 문자 인식 |
| `detection()` | `ddddocrDetectBuffer` | 문자 영역 bbox 검출 |
| `slide_match()` | `ddddocrSlideMatch` | 슬라이드 캡차 매칭 |
| `slide_comparison()` | `ddddocrSlideComparison` | 슬라이드 이미지 비교 |
| FastAPI `/ocr` | `extractDocumentTextClient` | PDF 스캔 폴백·이미지 OCR |
| Docker `python -m ddddocr api` | `NEXT_PUBLIC_DDDDOCR_URL` | 자체 호스트 API |

```bash
# ddddocr API 서버 (Docker 또는 로컬)
docker compose up -d   # ddddocr 리포 루트
# 또는
pip install "ddddocr[api]"
python -m ddddocr api --host 0.0.0.0 --port 8000

NEXT_PUBLIC_DDDDOCR_URL=http://localhost:8000
```

뷰어 → **보기** 탭 **OCR** — 엔진 선택(자동/ddddocr/Tesseract), ddddocr 연결 시 목표 검출·슬라이드 도구 패널 표시

## hwpx-skill에서 이식 (v2.2.0)

[hwpx-skill](https://github.com/jkf87/hwpx-skill) AI 에이전트용 HWP/HWPX 워크플로우를 lofice **한글 AI** 패널로 통합.

| hwpx-skill | lofice | 비고 |
|------------|--------|------|
| Workflow A (마크다운→HWPX) | `hwpxSkillCreateFromMarkdown` | report/gonmun/minutes 등 템플릿 |
| Workflow B/F (양식 치환) | `hwpxSkillCloneForm` | clone_form.py API |
| Workflow E (텍스트 추출) | `hwpxSkillExtract` / `extractHancomTextClient` | 서버·클라이언트 폴백 |
| Workflow H (HWP→HWPX) | `hwpxSkillConvertHwp` | convert_hwp.py |
| SKILL.md Decision Tree | `/ai/chat` | OPENAI_API_KEY 서버 설정 |
| `HwpAiAssistant` | `/hwp-ai/` · 뷰어 **한글 AI** 탭 | 채팅·빠른 작업 |

```bash
git clone https://github.com/jkf87/hwpx-skill.git
cd hancom/services/hwpx-skill-api
pip install -r requirements.txt
export HWPX_SKILL_DIR=/path/to/hwpx-skill
export OPENAI_API_KEY=sk-...   # AI 채팅 (선택)
python main.py

NEXT_PUBLIC_HWPX_SKILL_URL=http://localhost:8100
```

HWP 뷰어 → **보기** 탭 **한글 AI** 또는 `/hwp-ai/`

## 7-Zip에서 이식 (v2.3.0)

[7-Zip](https://github.com/shinkang888-code/7zip) (Igor Pavlov 7-Zip 26.x 소스) 핵심 CLI 기능을 **7z-wasm** 브라우저 엔진으로 통합.

| 7-Zip CLI | lofice | 비고 |
|-----------|--------|------|
| `l` (목록) | `archiveList` | 7z/zip/rar/tar/gz/xz/wim/iso 등 |
| `x` (압축 풀기) | `archiveExtract` | 선택·전체 추출 → ZIP 다운로드 |
| `t` (테스트) | `archiveTest` | 무결성 검사 |
| `a` (압축) | `archiveCreate` | .7z / .zip 생성 |
| 7zFM / 7zG UI | `ArchivePanel` | 목록·체크박스·압축 UI |
| ZIP 빠른 경로 | JSZip | 소형 zip 전용 폴백 |

```bash
npm install   # postinstall이 7zz.wasm → public/7z-wasm/ 복사
```

압축 파일 뷰어: `/viewer/?id=...` 또는 `/archive/`

지원 형식: **7z, ZIP, RAR, TAR, GZIP, BZIP2, XZ, WIM, ISO, CAB, DEB, RPM** (7-Zip WASM 24.09 기준)

## Office Tool Plus에서 이식 (v2.4.0)

[Office Tool Plus](https://github.com/YerongAI/Office-Tool) (로컬라이제이션: [shinkang888-code/Office-Tool](https://github.com/shinkang888-code/Office-Tool))의 웹 적용 가능 기능을 lofice **도구 상자**로 통합. Windows 전용 Office 설치·KMS·COM 변환은 브라우저에서 대체 구현.

| Office Tool Plus | lofice | 비고 |
|------------------|--------|------|
| 도구 상자 (Toolbox) | `/toolbox/` | 빠른 링크·캐시 삭제·설정 초기화 |
| 문서 변환 (ConvertDocuments) | `/convert/` | docx/xlsx/hwp/hwpx/txt/md → txt/html/csv/md/json |
| 해시 체크 (HashChecker) | `/toolbox/?tab=hash` | Web Crypto SHA-256/384/512/1 |
| 환경설정·테마 | 설정 → 모양 | polaris / light / dark |
| 설정 내보내기·가져오기 | `SettingsIoPanel` | JSON 백업 |
| 시간대별 인사 (ko-kr) | 홈 greeting | OTP ko-kr.xaml 패턴 |

```bash
# 클라이언트 전용 — 추가 서버 불필요
npm run dev
# /toolbox/ · /convert/ · 설정
```

## msoffice에서 이식 (v2.5.0)

[msoffice](https://github.com/shinkang888-code/msoffice) (herumi/msoffice) — **MS-OFFCRYPTO** 기반 Office 문서 암·복호화.
일반 편집/뷰어가 아니라 **비밀번호로 보호된 Word/Excel/PowerPoint** 를 열고 저장하는 기능입니다.

| msoffice-crypt | lofice | 비고 |
|----------------|--------|------|
| `-e -p pass in out` | `encryptOfficeDocument` | docx/xlsx/pptx (Agile AES-256 기본) |
| `-d -p pass in out` | `decryptOfficeDocument` | OOXML + 레거시 doc/xls/ppt |
| `-encMode 0/1` | Agile / Standard 선택 | AES256 / AES128 |
| `isEncrypted` | `isOfficeEncrypted` | 뷰어 열기 전 자동 감지 |
| `msoc.dll` (Windows) | `services/msoffice-api` | 선택적 네이티브 API |
| MS-OFFCRYPTO | `officecrypto-tool` | 브라우저 클라이언트 (기본) |

```bash
npm install   # officecrypto-tool + buffer polyfill
# /office-crypto/ — 암·복호화 도구
# 뷰어 — 암호화된 docx/xlsx/pptx 열 때 비밀번호 입력
```

선택 (Electron/Windows 네이티브):

```bash
cd services/msoffice-api
set MSOFFICE_CRYPT_BIN=C:\path\to\msoffice-crypt.exe
pip install -r requirements.txt
python main.py
NEXT_PUBLIC_MSOFFICE_CRYPTO_URL=http://localhost:8200
```

## msoffice-removal-tool에서 이식 (v2.6.0)

[msoffice-removal-tool](https://github.com/shinkang888-code/msoffice-removal-tool) — Windows Office 제거 + Office365 재설치 스크립트.
lofice는 **Office 제거 후 lofice로 전환**하는 웹/Electron 마이그레이션 마법사로 이식했습니다.

| removal-tool | lofice | 비고 |
|--------------|--------|------|
| SaRA 제거 | `runLightCleanup()` | IndexedDB + 환경설정 |
| Setup 제거 | `runDeepCleanup()` | + Cache API · SW · localStorage |
| `-InstallOffice365` | lofice PWA/Electron/APK 안내 | Office365 대신 |
| Stage 메커니즘 | `migration-stages.ts` | localStorage 단계 저장 |
| `-Force` / `-RunAgain` | 마이그레이션 UI 옵션 | |
| `msoffice-removal-tool.ps1` | PowerShell 명령 복사 + `scripts/lofice-office-migration.ps1` | Windows 관리자 |

```bash
# 웹 마이그레이션 마법사
/migrate/

# Windows PowerShell (관리자 — Office 제거)
powershell -ExecutionPolicy Bypass -File scripts/lofice-office-migration.ps1 -InstallLofice -SuppressReboot
```

## Office-PowerPoint-MCP-Server에서 이식 (v2.7.0)

[Office-PowerPoint-MCP-Server](https://github.com/shinkang888-code/Office-PowerPoint-MCP-Server) — python-pptx 기반 **32 MCP tools** (템플릿·차트·디자인·텍스트 추출).
lofice **PPT AI** 패널로 웹 이식.

| MCP Tool | lofice | 비고 |
|----------|--------|------|
| extract_presentation_text | `extractPresentationTextClient` | 클라이언트 JSZip |
| create_presentation_from_templates | `createPresentationFromTemplates` | 16+ 템플릿 · 8 컬러 스킴 |
| list_slide_templates | `PPT_SLIDE_TEMPLATES` | slide_layout_templates 메타 |
| apply_professional_design | 컬러 스킴 + JSZip export | modern_blue 등 |
| auto_generate_presentation | `pptMcpAutoGenerate` | OPENAI_API_KEY (선택) |
| 32 tools (전체) | `services/ppt-mcp-api` | python-pptx FastAPI |

```bash
cd services/ppt-mcp-api
pip install -r requirements.txt
python main.py

NEXT_PUBLIC_PPT_MCP_URL=http://localhost:8300
```

`/ppt-ai/` · 도구 상자 **PPT AI** · PPT 편집기 연동

## powerpoint Ruby gem에서 이식 (v2.8.0)

[shinkang888-code/powerpoint](https://github.com/shinkang888-code/powerpoint) — Ruby gem으로 PPTX 생성 (`add_intro`, `add_textual_slide`, `add_pictorial_slide`).
Ruby는 브라우저에서 실행할 수 없으므로 **TypeScript로 API 이식** + MCP API에서 AI outline 제공.

| Ruby gem API | lofice | 비고 |
|--------------|--------|------|
| `Powerpoint::Presentation.new` | `PowerpointPresentation` | `src/lib/powerpoint/deck.ts` |
| `add_intro(title, subtitle)` | `addIntro` | intro 슬라이드 |
| `add_textual_slide(title, content[])` | `addTextualSlide` | 불릿 목록 |
| `add_pictorial_slide(title, image)` | `addPictorialSlide` | 이미지 URL |
| `save('file.pptx')` | `deck.save()` | JSZip pptx-export |
| AI outline (신규) | `generateAiPowerpointDeck` | `POST /ai-deck` |

```bash
# AI PPT (OpenAI 선택)
NEXT_PUBLIC_PPT_MCP_URL=http://localhost:8300
OPENAI_API_KEY=sk-...

# /ppt-ai/ → "AI로 PPT 생성" (API 없으면 휴리스틱 fallback)
```

| 엔드포인트 | 설명 |
|-----------|------|
| `POST /ai-deck` | powerpoint gem JSON outline 반환 |
| `POST /ai-deck/pptx` | outline → python-pptx PPTX bytes |

## PowerPoint-Generator-Python-Project에서 이식 (v2.9.0)

[PowerPoint-Generator-Python-Project](https://github.com/shinkang888-code/PowerPoint-Generator-Python-Project) — Flask + GPT-3.5 + Pexels + python-pptx 웹 앱.
lofice **GPT Generator** 패널로 이식 (로그인/DB 제외).

| 원본 (Flask) | lofice | 비고 |
|--------------|--------|------|
| `chat_development()` | `ppt_generator.chat_development` | GPT 슬라이드 아이디어 |
| `parse_response()` | `parseGptSlideResponse` | Slide N / Keyword 파싱 |
| `create_ppt()` | `create_ppt_bytes()` | python-pptx 테마·이미지 |
| `search_pexels_images()` | Pexels API | `PEXELS_API_KEY` |
| `template_choice` | dark_modern / bright_modern / classic | `/ppt-ai/` 테마 선택 |
| `insert_image` | 체크박스 | 슬라이드별 키워드 이미지 |

```bash
cd services/ppt-mcp-api
pip install -r requirements.txt
OPENAI_API_KEY=sk-... PEXELS_API_KEY=... python main.py

NEXT_PUBLIC_PPT_MCP_URL=http://localhost:8300
```

| 엔드포인트 | 설명 |
|-----------|------|
| `POST /generator/generate` | GPT → PPTX bytes (+ Pexels 이미지) |
| `POST /generator/outline` | GPT 슬라이드 JSON만 |

## PptxGenJS에서 이식 (v2.10.0)

[shinkang888-code/PptxGenJS](https://github.com/shinkang888-code/PptxGenJS) — JavaScript로 PPTX 생성 (gitbrent/PptxGenJS fork).
브라우저에서 **차트·테이블·도형·HTML table→슬라이드** 지원.

| PptxGenJS API | lofice | 비고 |
|---------------|--------|------|
| `new pptxgen()` | `createPresentation()` | `src/lib/pptxGenJS/client.ts` |
| `slide.addText()` | `exportSlidesWithPptxGenJS` | 기존 슬라이드 내보내기 엔진 |
| `slide.addChart()` | `buildFeatureDemo()` | bar / doughnut |
| `slide.addTable()` | `buildFeatureDemo()` | 스타일 테이블 |
| `slide.addShape()` | `buildFeatureDemo()` | roundRect |
| `pres.tableToSlides()` | `exportHtmlTableToPptx()` | HTML `<table>` → PPT |
| `pres.write({ outputType })` | `writePresentationArrayBuffer()` | ArrayBuffer 다운로드 |

```bash
npm install pptxgenjs   # postinstall → public/vendor/pptxgen.bundle.js

# /ppt-ai/ → PptxGenJS 패널 (런타임 스크립트 로드)
# Hello World · 차트·테이블·도형 · AI 덱 · HTML table → PPT
```

기존 `exportSlidesToPptx()`는 **PptxGenJS 우선**, 실패 시 JSZip fallback.

## TypeScript-React-Conversion-Guide에서 이식 (v2.11.0)

[TypeScript-React-Conversion-Guide](https://github.com/shinkang888-code/TypeScript-React-Conversion-Guide) — JS→TS React 변환 가이드 (Microsoft TicTacToe 예제).
lofice는 이미 TypeScript이므로 **타입 패턴·이벤트 버스**를 이식.

| 가이드 패턴 | lofice | 비고 |
|-------------|--------|------|
| `GameState` string literal | `DocumentLoadState`, `PptGenerationSource` | `src/lib/reactTypes/constants.ts` |
| `React.Component<{}, State>` | `PptAiAssistantProps` 등 | `component-props.ts` |
| `gameStateChange` CustomEvent | `LoficeEventMap` | typed dispatch/subscribe |
| `componentDidMount` listener | `useLoficeEvent()` | hooks.ts |
| `strictNullChecks` | `tsconfig.json` | explicit 활성화 |

```typescript
import { dispatchLoficeEvent, useLoficeEvent } from "@/lib/reactTypes";

// PPT 생성 시
dispatchLoficeEvent("lofice:pptGenerated", { fileName: "a.pptx", source: "pptxgenjs" });

// Android intent (기존 lofice:openFile) — 타입 안전 구독
useLoficeEvent("lofice:openFile", (detail) => { /* detail.name, detail.data */ });
```

## 오픈소스 통합 (v1.6.0)

| 리포 | 패키지 | 활용 |
|------|--------|------|
| [docMentis/docmentis-udoc-viewer](https://github.com/docMentis/docmentis-udoc-viewer) | `@docmentis/udoc-viewer` | WASM 고속 PDF/DOCX 뷰어 (1순위) |
| [eigenpal/docx-editor](https://github.com/eigenpal/docx-editor) | `@eigenpal/docx-editor-react` | DOCX WYSIWYG 편집 (1.x) |
| [shubham8550/microscope-js](https://github.com/shubham8550/microscope-js) | `@microscope-js/*` | DOCX/XLSX/PDF 폴백 뷰어 |
| [sechan9999/rhwp](https://github.com/sechan9999/rhwp) | `@rhwp/core` | HWP WASM SVG 렌더 |

`npm install` 시 `postinstall`이 WASM/worker 파일을 `public/`으로 복사합니다.

## 시연 확인 포인트

1. 홈 → 문서 열기 또는 PDF 드래그앤드롭
2. **보기** 탭 → 확대/축소, 썸네일, 페이지 이동
3. **파일** 탭 → 다운로드, 인쇄
4. PDF 1페이지가 즉시 표시되는지 확인
5. HWP → @rhwp/core SVG 렌더 / DOCX → microscope-js 뷰어
6. DOCX 편집 → eigenpal 에디터에서 저장 후 다운로드

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 환경 변수 (선택 - 클라우드 동기화)

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Supabase SQL Editor에서 `supabase/migrations/001_storage.sql` 실행

## 안드로이드 앱 빌드

```bash
npm run build
npx cap sync android
npx cap open android
```

Android Studio에서 **Build > Build Bundle(s) / APK(s) > Build APK(s)**

또는:

```bash
scripts\build-android.bat
```

생성 위치:
- APK: `android\app\build\outputs\apk\debug\app-debug.apk`
- ZIP: `releases\lofice-Android-1.5.0.zip`

## Windows 앱 빌드 (Electron)

```bash
npm run electron:dev   # 개발
npm run build:win      # 설치 파일
```

생성 위치: `dist/lofice-Setup-1.5.0.exe`

자세한 내용: [electron/README.md](electron/README.md)

## 프로젝트 구조

```
src/
├── app/           # Next.js 페이지
├── components/
│   ├── viewer/    # 문서 뷰어
│   ├── editor/    # 문서 편집기
│   ├── office/    # LoficeLayout 리본 UI
│   └── layout/    # 헤더, 하단 네비
├── lib/
│   ├── parsers/   # 형식별 파서
│   └── storage/   # IndexedDB
docs/
└── LOFICE-SPEC.md # 개발 명세서
```

## 라이선스

MIT
