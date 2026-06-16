# OneOffice (원오피스)

광고 없는 무료 문서 뷰어 & 오피스 MVP. HWPX, DOCX, XLSX, PDF, TXT 지원.

## 기능

- **뷰어 (1순위)**: HWPX, DOCX, XLSX, PDF, TXT 즉시 열람
- **편집 (2순위)**: DOCX(TipTap), XLSX(스프레드시트 에디터)
- **광고 없음**: 추적·광고·텔레메트리 코드 없음
- **오프라인**: IndexedDB 로컬 저장
- **안드로이드**: Capacitor 네이티브 앱
- **Windows**: Electron 설치 프로그램 (.exe)

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
npx cap add android    # 최초 1회
npx cap sync android
npx cap open android   # Android Studio에서 빌드
```

Android Studio에서 **Build > Build Bundle(s) / APK(s) > Build APK(s)**

또는 명령줄로 APK + ZIP 생성:

```bash
scripts\build-android.bat
```

생성 위치:
- APK: `android\app\build\outputs\apk\debug\app-debug.apk`
- ZIP: `releases\OneOffice-Android-0.1.0.zip`

## Windows 앱 빌드 (Electron)

### 개발 모드
```bash
npm run electron:dev
```

### 설치 파일 (.exe)
```bash
npm run build:win
```

생성 위치: `dist/OneOffice-Setup-0.1.0.exe`

- 바탕화면/시작 메뉴 바로가기
- `.hwpx`, `.docx`, `.xlsx`, `.pdf` 등 파일 연결
- 광고·추적 없음

자세한 내용: [electron/README.md](electron/README.md)

## 프로젝트 구조

```
src/
├── app/           # Next.js 페이지 (홈, 뷰어, 에디터, 설정)
├── components/
│   ├── viewer/    # 문서 뷰어 (HWPX, DOCX, XLSX, PDF)
│   ├── editor/    # 문서 편집기 (TipTap, Spreadsheet)
│   ├── files/     # 파일 선택/목록
│   └── layout/    # 헤더, 하단 네비
├── lib/
│   ├── parsers/   # HWPX, DOCX, XLSX 파서
│   ├── storage/   # IndexedDB 로컬 저장
│   └── supabase/  # 클라우드 (선택)
└── types/
```

## 지원 형식

| 형식 | 뷰어 | 편집 |
|------|------|------|
| HWPX | O | - |
| DOCX | O | O |
| XLSX | O | O |
| PDF  | O | - |
| TXT  | O | - |

## 다음 업그레이드 예정

- HWPX 편집 지원
- Luckysheet 고급 스프레드시트
- HWP 바이너리 형식 지원
- 클라우드 동기화
- 프레젠테이션(PPTX) 뷰어

## 라이선스

MIT
