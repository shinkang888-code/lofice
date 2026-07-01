# Loffice Windows 빌드 가이드

## 빌드

```powershell
npm run build:win
```

생성 파일:

```
dist/Loffice-Setup-2.25.0.exe
```

## 기능

- 더블클릭으로 Loffice 실행
- `.hwpx`, `.docx`, `.xlsx`, `.pdf` 등 파일 연결
- 탐색기에서 문서 더블클릭 → Loffice로 열기

## 구조

```
lofice (Windows)
├── electron/
│   ├── main.js
│   └── preload.js
└── dist/
    └── Loffice-Setup-<version>.exe
```

## 문제 해결

- **아이콘 오류**: `public/lofice-icon.png` 존재 확인 후 `npm run prebuild:win`
- **파일 연결 안 됨**: 설치 후 Windows "기본 앱" 설정에서 Loffice 선택
