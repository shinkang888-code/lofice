# lofice (로피스)

광고 없는 무료 문서 뷰어 & 오피스. HWPX, DOCX, XLSX, PDF, 이미지 등 다형식 지원.

**웹:** https://lofice-one.vercel.app · https://lawbox-one.vercel.app

## 기능

- **뷰어**: HWPX, DOCX, XLSX, PDF, PPTX, ODT, TXT, 이미지, MD, HTML, JSON 등 (60+ 형식)
- **고속 WASM 뷰어**: @docmentis/udoc-viewer — PDF/DOCX 네이티브 렌더 (폴백: pdfjs / microscope-js)
- **고속 PDF**: pdfjs 워커 프리로드 + 1페이지 우선 렌더링 (UDoc 폴백)
- **HWP/HWPX**: @rhwp/core WASM 네이티브 렌더 (폴백: hwpxjs)
- **DOCX 편집**: @eigenpal/docx-editor-react 1.x WYSIWYG (실제 DOCX 저장)
- **한글 편집**: TipTap + 폴라리스 스타일 페이지 레이아웃, 리본 연동
- **시트 편집**: 수식 입력줄(fx), A1 셀 참조, 시트 탭, 키보드 탐색
- **OCR 텍스트 추출**: PDF 텍스트 레이어 → Tesseract OCR (LawyGo 패턴, 클라이언트 전용)
- **미리보기**: 파일 목록 인라인 패널 + 새 창 미리보기 (`/preview`)
- **광고 없음**: 추적·광고·텔레메트리 코드 없음
- **오프라인**: IndexedDB 로컬 저장
- **안드로이드**: Capacitor 네이티브 앱
- **Windows**: Electron 설치 프로그램 (.exe)

## LawyGo에서 이식 (v1.7.0)

| LawyGo | lofice | 비고 |
|--------|--------|------|
| `/api/document/ocr` | `extractDocumentTextClient` | static export → Tesseract.js 클라이언트 OCR |
| `PdfCanvasViewer` | `DocumentViewer` + UDoc/PdfViewer | 기존 뷰어 활용 |
| `DocumentPreviewPanel` | `components/preview/DocumentPreviewPanel` | IndexedDB 연동 |
| `PreviewButton` | `components/preview/PreviewButton` | 파일 목록 미리보기 |
| `pdfPreview.ts` | `lib/preview/documentPreview.ts` | `/preview` 새 창 |

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
