# lofice (로피스)

광고 없는 무료 문서 뷰어 & 오피스. HWPX, DOCX, XLSX, PDF, 이미지 등 다형식 지원.

**웹:** https://lofice-one.vercel.app (또는 https://lawbox-one.vercel.app)

## 기능

- **뷰어**: HWPX, DOCX, XLSX, PDF, TXT, 이미지, MD, HTML, JSON 등
- **편집**: DOCX(TipTap), XLSX(스프레드시트 에디터)
- **광고 없음**: 추적·광고·텔레메트리 코드 없음
- **오프라인**: IndexedDB 로컬 저장
- **안드로이드**: Capacitor 네이티브 앱 + 연결 프로그램
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
- ZIP: `releases\lofice-Android-1.2.0.zip`

## Windows 앱 빌드 (Electron)

```bash
npm run electron:dev   # 개발
npm run build:win      # 설치 파일
```

생성 위치: `dist/lofice-Setup-1.2.0.exe`

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
