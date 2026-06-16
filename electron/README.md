# lofice (로피스) Windows 빌드 가이드

## 빌드

```bash
npm run build:win
```

생성 파일:

```
dist/lofice-Setup-1.2.0.exe
```

## 기능

- 더블클릭으로 lofice 실행
- `.hwpx`, `.docx`, `.xlsx`, `.pdf` 등 파일 연결
- 탐색기에서 문서 더블클릭 → lofice로 열기

## 구조

```
lofice (Windows)
├── electron/
│   ├── main.js
│   └── preload.js
└── dist/
    └── lofice-Setup-1.2.0.exe
```

## 문제 해결

- **아이콘 오류**: `public/lofice-icon.png` 존재 확인
- **파일 연결 안 됨**: 설치 후 Windows "기본 앱" 설정에서 lofice 선택
