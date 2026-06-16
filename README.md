# lofice (로피스)

광고 없는 무료 문서 뷰어 & 오피스. HWPX, DOCX, XLSX, PDF, 이미지 등 다형식 지원.

**웹:** https://lofice-one.vercel.app · https://lawbox-one.vercel.app

## 기능

- **뷰어**: HWPX, DOCX, XLSX, PDF, PPTX, ODT, TXT, 이미지, MD, HTML, JSON 등 (60+ 형식)
- **고속 PDF**: 워커 프리로드 + 1페이지 우선 렌더링
- **HWP/HWPX**: @rhwp/core WASM 네이티브 렌더 (폴백: hwpxjs)
- **DOCX/XLSX 뷰어**: microscope-js 클라이언트 전용 렌더러
- **DOCX 편집**: @eigenpal/docx-js-editor WYSIWYG (실제 DOCX 저장)
- **편집**: TipTap(한글·텍스트), XLSX 스프레드시트 에디터
- **폴라리스 스타일 UI**: 리본(파일/홈/삽입/보기), 상태바, 드래그앤드롭
- **광고 없음**: 추적·광고·텔레메트리 코드 없음
- **오프라인**: IndexedDB 로컬 저장
- **안드로이드**: Capacitor 네이티브 앱
- **Windows**: Electron 설치 프로그램 (.exe)

## 오픈소스 통합 (v1.5.0)

| 리포 | 패키지 | 활용 |
|------|--------|------|
| [shubham8550/microscope-js](https://github.com/shubham8550/microscope-js) | `@microscope-js/*` | 클라이언트 전용 DOCX/XLSX/PDF 뷰어, 트리셰이킹 |
| [eigenpal/docx-editor](https://github.com/eigenpal/docx-editor) | `@eigenpal/docx-js-editor` | DOCX WYSIWYG 편집 |
| [sechan9999/rhwp](https://github.com/sechan9999/rhwp) | `@rhwp/core` | HWP WASM 엔진·SVG 렌더 |
| [docMentis/docmentis-udoc-viewer](https://github.com/docMentis/docmentis-udoc-viewer) | (다음 단계) | WASM 고속 PDF/DOCX 렌더 참고 |

`npm install` 시 `postinstall`이 `@rhwp/core`의 `rhwp_bg.wasm`을 `public/`으로 복사합니다.

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
