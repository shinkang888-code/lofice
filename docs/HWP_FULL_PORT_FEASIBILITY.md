# HWP/HWPX·컴퓨터 문서 전기능 이식 가능성 설계서

> **대상:** lofice(로피스) v2.19+  
> **질문:** 한컴·MS Office급 **모든 기능**을 오픈소스만으로 완전 이식할 수 있는가?  
> **결론 요약:** **100% 동등 재현은 불가능**하나, **실무 커버리지 75~90%**는 하이브리드 OSS 스택으로 달성 가능.

---

## 1. 핵심 결론

| 구분 | 판정 | 설명 |
|------|------|------|
| **한글(HWP 5.x / HWPX) 전기능** | ❌ OSS 단독 불가 | 매크로·배포용 DRM·한컴 전용 필드·일부 레이아웃·수식 엔진 등은 공개 스펙 밖 |
| **한글 실무 기능(열람·편집·변환·AI)** | ✅ 가능 (단계적) | rhwp + hwpx-owpml-model + neolord0 + hwpx-skill 조합 |
| **MS Office Open XML(DOCX/XLSX/PPTX)** | ⚠️ 70~85% | eigenpal/microscope로 편집·뷰, 레거시 .doc/.xls/.ppt·VBA는 제한 |
| **PDF·이미지·텍스트** | ✅ 90%+ | pdfjs, Stirling-PDF, OCR 파이프라인 |
| **한컴 오피스 100% 대체** | ❌ | COM 자동화(pyhwpx) 없이는 공공기관 호환·인쇄·배포용 HWP 완전 대체 불가 |

**전략:** “한컴/MS와 동일한 단일 엔진”이 아니라 **형식별 최적 OSS + 공통 문서 허브(lofice)** 로 **기능 계층(Tier)** 을 나눠 이식한다.

---

## 2. lofice 현재 기준선 (as-is)

```
[브라우저]
  ├─ HWP/HWPX 뷰: @rhwp/core (WASM SVG) → RhwpViewer
  ├─ HWP/HWPX 편집: @rhwp/editor (rhwp-studio iframe) → RhwpEditor
  ├─ HWP 폴백 파싱: @ssabrojs/hwpxjs (HWP→HWPX→HTML)
  ├─ HWP AI: hwpx-skill-api (Python, Vercel 별도)
  ├─ DOCX: @eigenpal/docx-editor-react / @docmentis/udoc-viewer
  ├─ XLSX/PPTX: @microscope-js/*, ppt-master
  ├─ PDF: pdfjs-dist, Stirling-PDF 패턴
  └─ 저장: IndexedDB (로컬), Supabase 연동 가능
```

| 영역 | 현재 수준 | 한계 |
|------|-----------|------|
| HWP 5.x 고품질 뷰 | rhwp SVG | 복잡 서식·도형 일부 누락 |
| HWPX 편집 | rhwp-studio | iframe·WASM 용량, 모바일 제약 |
| HWP→HWPX | hwpxjs 내부 변환 | 암호화·배포용 HWP 미지원 |
| 텍스트 추출/RAG | hwpxjs, kordoc 패턴 가능 | 표 구조·각주 정밀도 차이 |
| 배포용·암호 HWP | 미지원 | neolord0/hwpxlib_ext 또는 한컴 필요 |

---

## 3. 기능별 이식 가능성 매트릭스 (HWP/HWPX)

### 3.1 Tier 정의

- **T0** — 오픈소스로 **이미 또는 단기(3개월) 내** lofice에 통합 가능  
- **T1** — OSS로 **가능하나** 엔진 교체·서버 워커·대규모 QA 필요 (6~12개월)  
- **T2** — **부분 구현**만 가능 (폴백·단순화 UI)  
- **T3** — **한컴 상용/COM 또는 비공개 스펙** 필요 → OSS만으로 불가

### 3.2 HWP 5.x (바이너리)

| 기능 | Tier | 권장 OSS | lofice 통합 경로 |
|------|------|----------|------------------|
| 텍스트 추출 | T0 | rhwp, kordoc, hwplib | `lib/parsers/hancom.ts` → rhwp 우선 |
| 기본 레이아웃 뷰 | T0 | rhwp (`renderPageSvg`) | `RhwpViewer` |
| 표·이미지 뷰 | T1 | rhwp (지속 업데이트) | rhwp 버전 업 + 회귀 테스트 |
| 머리말/꼬리말·쪽번호 | T1 | rhwp, hwplib | 파서 정밀도 의존 |
| 각주/미주 | T1 | hwplib, rhwp | |
| 수식(HwpEqn) | T2 | hwplib 일부, rhwp 진행 중 | 수식 → 이미지 폴백 |
| 도형/그리기 개체 | T2 | rhwp | 편집은 제한적 |
| 스타일/스타일셋 | T1 | hwplib + OWPML 정규화 | HWP→HWPX 파이프라인 |
| 책갈피·교차참조 | T2 | hwplib | |
| 필드(누름틀·메일머지) | T2 | hwpx-skill `/clone-form` | 서버 워커 |
| 매크로(HWP 스크립트) | T3 | — | 실행 불가, 경고만 |
| 암호화 일반 HWP | T1 | hwplib (비밀번호) | 서버 사이드 Java |
| **배포용 DRM HWP** | T3 | hwpxlib_ext, 한컴 SDK | 라이선스·법적 검토 |
| HWP→HWPX 변환 | T0 | neolord0/hwp2hwpx, hwpxjs | `services/hwp-convert-worker` |
| HWP→PDF | T1 | hwplib + PDF 렌더 | Java 워커 또는 rhwp→인쇄 |

### 3.3 HWPX (OWPML)

| 기능 | Tier | 권장 OSS | lofice 통합 경로 |
|------|------|----------|------------------|
| 구조 파싱/검증 | T0 | hancom-io/hwpx-owpml-model, dvc | CI 적합성 테스트 |
| HTML/텍스트 추출 | T0 | hwpxjs, python-hwpx, metatag-ex | 기존 `hancom.ts` |
| 생성·편집 | T0~T1 | airmang/python-hwpx, hwpxlib, rhwp | 편집기 이중화 |
| 스타일·문단 속성 | T1 | OWPML 모델 직접 조작 | hwpx-skill + 로컬 API |
| 표 병합/분할 | T1 | hwpxlib, rhwp editor | |
| 이미지·OLE | T1 | hwpx-contents-extract | |
| 메타태그·양식 | T0 | metatag-ex, hwpx-skill | `/hwp-ai/` |
| HWPX→HTML (웹 뷰) | T0 | eeseol/hwpx-converter 패턴 | 서버 또는 WASM |
| AI 문서 생성 | T0 | hwpx-skill, hwpx-studio | 기존 `hwpx-skill-api` |

---

## 4. 컴퓨터 문서 전체 (Office·웹·기타)

| 형식 | 실무 커버리지 | 1순위 OSS | lofice 모듈 |
|------|---------------|-----------|-------------|
| DOCX/DOCM | 75~85% | eigenpal, microscope, mammoth | `/editor/`, UDoc |
| XLSX/XLS/CSV | 70~80% | SheetJS, microscope | SpreadsheetEditor |
| PPTX/PPT | 65~75% | microscope, ppt-master, PptxGenJS | `/ppt-editor/`, `/ppt-ai/` |
| ODT/ODS/ODP | 60~70% | ODF 파서 | `parsers/odf.ts` |
| PDF | 90%+ | pdfjs, pdf-lib, Stirling | `/pdf-editor/` |
| RTF/MHTML/MD/HTML | 85%+ | 자체 파서 | document-router |
| 이미지 | 95%+ | 브라우저 네이티브 | ImageViewer |
| .doc/.xls/.ppt (바이너리) | 40~55% | microscope, LibreOffice headless(서버) | 폴백·변환 워커 |
| .pub/.vsd/.mdb/.one | 10~20% | — | Unsupported + 메타만 |
| 암호 Office | T1 | officecrypto-tool | OfficeDecryptGate |

**MS Office 14(2010) 수준 “전기능”** 은 lofice `MSOFFICE-ARCHITECTURE.md` 기준으로도 **오픈소스만으로는 목표에서 제외**하는 것이 현실적이다.

---

## 5. 목표 아키텍처 (to-be)

```
                    ┌─────────────────────────────────────┐
                    │         lofice Document Hub          │
                    │  open · preview · viewer · editor    │
                    └─────────────────┬───────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
   [Client WASM/JS]           [Edge Workers]              [Optional Server]
   rhwp view/edit              가벼운 변환·검증              무거운 Java/Python
   hwpxjs fallback             DVC 스키마 체크               hwplib/hwpxlib
   pdfjs/microscope            HWP→HWPX 큐                 kordoc 배치
   eigenpal docx               OCR post-process              LibreOffice headless
          │                           │                           │
          └───────────────────────────┴───────────────────────────┘
                                      ▼
                         ┌────────────────────────┐
                         │   Canonical Model (CM)   │
                         │  선택 1: HWPX/OWPML 트리  │
                         │  선택 2: MD+YAML (RAG용)  │
                         │  선택 3: HTML (웹 뷰)     │
                         └────────────────────────┘
                                      ▼
                         Supabase Storage / IndexedDB
```

### 5.1 Canonical Model 권장

| 목적 | 정규 형식 | 이유 |
|------|-----------|------|
| **한글 왕복 편집** | HWPX (OWPML) | 한컴 공식 모델·dvc 검증·hwpxlib 호환 |
| **AI/RAG/검색** | Markdown + YAML 메타 | kordoc, hwp2yaml 패턴 |
| **웹 즉시 렌더** | HTML + CSS (손실 허용) | hwpxjs, hwpx-converter |
| **장기 보존** | 원본 바이너리 + HWPX 사본 | Storage 이중 저장 |

**HWP 업로드 파이프라인 (권장):**

```
.hwp 업로드
  → [1] rhwp 즉시 뷰 (UX)
  → [2] 백그라운드: hwp2hwpx (neolord0 또는 kossembly-dot)
  → [3] dvc 적합성 검사 (hancom-io/dvc)
  → [4] HWPX를 CM으로 저장 + 원본 보관
  → [5] 편집은 rhwp-editor 또는 OWPML 직접 편집 API
```

---

## 6. OSS 조합 — lofice 권장 스택

### 6.1 한글 전용 (사용자 제공 목록 기반)

| 레이어 | 1순위 | 2순위 | 라이선스 |
|--------|-------|-------|----------|
| **스펙·학습** | helper_hwp, 한컴 PDF 5.0 | hwp5-schema.md | 문서 |
| **공식 OWPML** | hancom-io/hwpx-owpml-model | dvc, metatag-ex | 한컴 OSS 라이선스 확인 |
| **브라우저 뷰/편집** | edwardkim/rhwp (`@rhwp/*`) | golbin/hop | MIT ✅ |
| **HWP 5.x 안정 파싱** | neolord0/hwplib | mete0r/pyhwp | Apache / AGPL ⚠️ |
| **HWPX 읽기/쓰기** | neolord0/hwpxlib | airmang/python-hwpx | |
| **HWP→HWPX** | neolord0/hwp2hwpx | kossembly-dot/hwp2hwpx (pip) | |
| **대량 텍스트/RAG** | chrisryugj/kordoc | rhwp CLI | |
| **AI 양식·생성** | hwpx-skill (기존) | hwpx-studio | |
| **웹 HTML 변환** | eeseol/hwpx-converter | hwpxjs | |

### 6.2 제외·주의

| 리포 | 이유 |
|------|------|
| martiniifun/pyhwpx | Windows + 한컴 COM → 서버/Linux 부적합 |
| mete0r/pyhwp | AGPL, 유지보수 정체 |
| 한컴 바이너리 역공학 | 법적·라이선스 리스크 |

---

## 7. 단계별 로드맵

### Phase 0 — 현재 유지·강화 (0~2개월)

- [ ] rhwp `@rhwp/core` / `@rhwp/editor` 최신 동기화
- [ ] `hwpx-skill-api` 프로덕션 안정화 (`/health`, Vercel env)
- [ ] HWP 회귀 테스트: `test-fixtures/*.hwp` + dvc 리포트
- [ ] 폴백 체인 명시: rhwp → hwpxjs → 텍스트 only

### Phase 1 — 정규화 파이프라인 (2~4개월)

- [ ] `services/hwp-normalize-worker` (Java hwplib + hwp2hwpx 또는 Node+rhwp)
- [ ] 업로드 시 HWPX 사본 자동 생성 → Supabase Storage
- [ ] hancom-io/dvc 연동 CI (PR마다 적합성 %)
- [ ] kordoc 스타일 MD 추출 API (`/extract/md`)

### Phase 2 — 편집 기능 확장 (4~8개월)

- [ ] OWPML 직접 편집 레이어 (python-hwpx 또는 hwpxlib REST)
- [ ] 표·이미지·스타일 편집 rhwp-studio + OWPML 듀얼 저장
- [ ] 필드/누름틀: hwpx-skill `clone-form` UI 연동
- [ ] 암호 HWP: hwplib 서버 복호화 게이트

### Phase 3 — Office 통합 품질 (8~12개월)

- [ ] LibreOffice headless 변환 워커 (.doc/.ppt 레거시)
- [ ] microscope/eigenpal 버전 고정 + 시각 회귀 테스트
- [ ] 단일 CM에서 HWPX ↔ DOCX 변환 (손실 문서화)

### Phase 4 — “불가 영역” 명시 (지속)

- [ ] 매크로·배포용 DRM·한컴 전용 플러그인 → **지원 불가 안내** UI
- [ ] 호환성 리포트 PDF (dvc + 자체 체크리스트)

---

## 8. “완전 이식” 불가 항목 (명시적 스코프 아웃)

다음은 OSS·lofice 아키텍처로 **대체 불가** — 제품 정책으로 “미지원” 처리 권장:

1. **HWP 매크로 실행** (HWP Script)
2. **배포용 문서 DRM** (한컴 배포용 스펙 전용)
3. **한컴 오피스 COM/API 100% 호환** (pyhwpx 수준)
4. **인쇄물 픽셀 완벽 재현** (한컴 전용 폰트·프린터 드라이버)
5. **.activeX / 구형 플러그인** 연동
6. **.one / .pub / .vsd** 등 MS 전용 포맷 완전 편집

---

## 9. 의사결정 가이드

| 사용자 요구 | 권장 경로 |
|-------------|-----------|
| **텍스트만** (검색·AI) | rhwp 또는 kordoc → MD → 기존 OCR/PDF 파이프라인 |
| **HWPX 보존** (공문·양식) | hwp2hwpx → hwpxlib/python-hwpx 편집 → dvc 검증 |
| **브라우저 즉시 열람** | rhwp (현행) + hwpxjs 폴백 |
| **공공기관 제출용** | HWPX 사본 + 호환성 리포트; **원본 한컴으로 최종 검수** 권장 |
| **Linux/서버 배치** | Java(hwplib) 또는 Python(kordoc) 워커 — COM 금지 |

---

## 10. 최종 답변

> **한글(HWP/HWPX) 및 컴퓨터 문서의 “모든 기능”을 오픈소스만으로 한컴·MS Office와 동일하게 완전 이식하는 것은 불가능하다.**

다만 lofice는 이미 **MIT rhwp + hwpxjs + Office OSS** 기반으로 **실무 핵심 경로(열기·보기·편집·변환·AI)** 의 상당 부분을 갖추고 있다.  
위 Phase 0~3를 따르면:

- **한글:** 열람·기본편집·HWPX 정규화·AI 양식 → **~80%**  
- **Office Open XML:** → **~75%**  
- **PDF/이미지/텍스트:** → **~90%**  

**“완전 이식” 대신 “계층형 호환 + 손실 투명성 + 한컴 공식 OSS(dvc/OWPML) 검증”** 을 제품 목표로 삼는 것이 lofice/LawyGo에 적합하다.

---

## 11. 다음 액션 (lofice 팀)

1. **스코프 확정:** 텍스트-only vs HWPX 보존 vs 픽셀급 인쇄 호환 중 1순위 선택  
2. **PoC 2주:** `neolord0/hwp2hwpx` vs `rhwp exportHwpx` 동일 문서 10종 비교  
3. **워커 프로토타입:** `services/hwp-normalize-worker` (Java 또는 기존 hwpx-skill-api 확장)  
4. **호환성 대시보드:** dvc 결과 + rhwp 렌더 스냅샷을 `/settings/` 또는 내부 CI에 노출  

---

*참고: 한컴 공식 OSS — https://developer.hancom.com/opensources · lofice 기존 명세 — `docs/MSOFFICE-ARCHITECTURE.md`, `docs/LOFFICE_UPGRADE_SPEC.md`*
