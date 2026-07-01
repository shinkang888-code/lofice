# Loffice 고객 납품 가이드 (Desktop + Engine)

**버전:** 2.25.0 · **날짜:** 2026-07-01

## 납품 구성

| 구성요소 | 경로 | 역할 |
|----------|------|------|
| Loffice Desktop EXE | `lofice/dist/Loffice-Setup-*.exe` | Windows 설치 프로그램 |
| Loffice Engine | `Loffice/engine/server.mjs` | LibreOffice headless + WOPI |
| Collabora | `Loffice/docker-compose.yml` | Writer/Calc **전체 메뉴** 편집기 |
| 웹 UI (선택) | `Loffice/` Next.js :3001 | `/workspace` 데스크탑 Chrome |

## Phase A — Writer/Calc 전체 메뉴 (필수)

### 1) Collabora + 엔진 기동

```powershell
cd C:\cursor\Loffice
docker compose up -d
npm run dev:engine
```

- Collabora: http://localhost:9980
- Engine API: http://127.0.0.1:9982/health

### 2) Desktop에서 열기

1. `Loffice-Setup-2.25.0.exe` 설치
2. **설정 → Loffice LibreOffice 엔진** → URL `http://127.0.0.1:9982` → 연결 테스트
3. `.docx` / `.xlsx` 등 열기 → **Collabora 전체 UI** (`/engine-editor/`)

엔진 미실행 시: WASM 뷰어(`/viewer/`)로 폴백.

### 3) 웹 workspace (Loffice)

```powershell
cd C:\cursor\Loffice
npm run dev
```

브라우저 http://localhost:3001 → 파일 업로드 → `/workspace`  
→ Collabora iframe + **LibreOffice XML 파싱 전체 menubar**

## Phase B — 법적 고지 (저작권 등록)

- `lofice/LICENSE` — MIT (자작 코드)
- `lofice/THIRD_PARTY_NOTICES.md` — LibreOffice MPL, OSS 목록
- 앱 내 **설정 → 라이선스 및 고지**

## Phase C — 빌드·배포

```powershell
cd C:\cursor\lofice
npm run build:win
Copy-Item dist\Loffice-Setup-*.exe $env:USERPROFILE\Downloads\
```

## Phase D — 검수 체크리스트

- [ ] `/health` → `"collabora": true`
- [ ] Desktop docx → engine-editor → Writer 메뉴 표시
- [ ] Desktop xlsx → Calc 시트 편집
- [ ] 엔진 OFF → viewer 폴백
- [ ] 설정 → legal 페이지 표시
- [ ] EXE 속성 ProductName Loffice

## 아키텍처

```
Loffice Desktop (Electron)
  └─ Next.js static (127.0.0.1)
       ├─ /engine-editor/ → Collabora iframe (전체 메뉴)
       └─ /viewer/        → WASM 폴백

Loffice Engine (:9982) + Docker Collabora (:9980)
  └─ LibreOffice Core (LOK)
```

## 지원

- Engine 로그: `Loffice` 터미널 `npm run dev:engine`
- Collabora: `docker logs loffice-collabora`
