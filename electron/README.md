# OneOffice Windows 빌드 가이드

## 개발 모드 (Electron + Next.js)

```bash
npm install
npm run electron:dev
```

Next.js 개발 서버와 Electron 창이 함께 실행됩니다.

## Windows 설치 파일 (.exe) 빌드

```bash
npm run build:win
```

생성 위치:
```
dist/OneOffice-Setup-0.1.0.exe
```

## 설치 후 기능

- 바탕화면 / 시작 메뉴 바로가기
- 더블클릭으로 OneOffice 실행
- 파일 연결: `.hwpx`, `.hwp`, `.docx`, `.doc`, `.xlsx`, `.xls`, `.csv`, `.pdf`, `.txt`
- 탐색기에서 문서 더블클릭 → OneOffice로 열기
- 광고·추적 없음 (완전 로컬 앱)

## 포터블 버전 (설치 없이 실행)

```bash
npm run build:win:portable
```

## 구조

```
OneOffice (Windows)
├── electron/main.js      ← Electron 메인 프로세스
├── electron/preload.js   ← 파일 열기 IPC
├── out/                  ← Next.js 정적 빌드
└── dist/                 ← electron-builder 출력
    └── OneOffice-Setup-0.1.0.exe
```

## 문제 해결

- **빌드 실패**: `npm install` 후 다시 시도
- **아이콘 오류**: `public/oneoffice-app-icon.png` 존재 확인
- **파일 연결 안 됨**: 설치 후 Windows "기본 앱" 설정에서 OneOffice 선택
