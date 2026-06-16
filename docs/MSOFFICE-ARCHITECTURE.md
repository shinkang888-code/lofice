# Microsoft Office 14 (Office 2010) 구조 분석

> 분석 경로: `C:\Program Files (x86)\Microsoft Office\Office14`  
> lofice(로피스)는 **MS Office 바이너리/DLL을 사용하지 않고**, 아래 아키텍처를 참고해 오픈소스 스택으로 동일 역할을 재구현합니다.

---

## 1. 핵심 실행 파일 ↔ 앱 매핑

| 실행 파일 | 역할 | 핵심 엔진 DLL |
|-----------|------|----------------|
| `WINWORD.EXE` | Word 문서 편집/뷰 | `WWLIB.DLL`, `GKWord.dll` |
| `EXCEL.EXE` | Excel 스프레드시트 | `GKExcel.dll`, `XLCALL32.DLL` |
| `POWERPNT.EXE` | PowerPoint 프레젠테이션 | `PPCORE.DLL`, `GKPowerPoint.dll` |
| `MSPUB.EXE` | Publisher | `PUBCONV.DLL` |
| `MSACCESS.EXE` | Access DB | `ACEDAO.DLL`, `ACCDDS.DLL` |
| `ONENOTE.EXE` | OneNote | `ONMAIN.DLL`, `ONFILTER.DLL` |
| `OUTLOOK.EXE` | 메일/일정 | `OUTLFLTR.DLL`, `OUTLMIME.DLL` |
| `VPREVIEW.EXE` | **통합 미리보기 뷰어** | `VVIEWER.DLL`, `VVIEWDWG.DLL` |
| `CLVIEW.EXE` | 복합 문서 뷰어 | — |
| `OIS.EXE` | 이미지 삽입/스캔 | `OISAPP.DLL`, `OISGRAPH.DLL` |

---

## 2. 형식 변환·필터 파이프라인

MS Office는 문서를 열 때 **필터 DLL → 공통 XML/객체 모델 → 렌더** 순으로 처리합니다.

| 구성 요소 | 파일 | 기능 |
|-----------|------|------|
| Open XML 코어 | `OFFXML.DLL` | DOCX/XLSX/PPTX ZIP+XML 파싱 |
| 그래픽 객체 | `OART.DLL`, `OARTCONV.DLL` | 도형·차트·이미지 렌더 |
| Word 레거시 변환 | `Wordcnv.dll`, `Wordcnvr.dll`, `Wordconv.exe` | `.doc` → 내부 형식 |
| Excel 변환 | `excelcnv.exe`, `excelcnvpxy.dll` | `.xls` 등 레거시 |
| RTF 렌더 | `RTFHTML.DLL` | RTF → HTML/내부 형식 |
| Publisher | `PUBCONV.DLL` | `.pub` 변환 |
| Outlook 필터 | `OUTLFLTR.DLL`, `OUTLFLTR.DAT` | `.msg`, `.eml` 등 |
| Visio 뷰 | `VVIEWDWG.DLL` | DWG/VSD 미리보기 |
| DWG | `VVIEWDWG.DLL` | CAD 도면 미리보기 |

**lofice 대응:** `document-router.ts`가 `OFFXML`+필터 역할을 하며, 형식별 파서로 디스패치합니다.

---

## 3. 레지스트리 기반 지원 형식 (실측)

### Word (`WINWORD.EXE\SupportedTypes`)

`.docx` `.docm` `.dotx` `.dotm` `.doc` `.dot` `.htm` `.html` `.mht` `.mhtml` `.xml` `.rtf` `.odt` `.wpd` `.wps` `.txt` `.wri`

### 이미지 (`OIS.EXE\SupportedTypes`)

`.tif` `.tiff` `.dib` `.jpeg` `.jpg` `.jfif` `.jpe` `.bmp` `.png` `.gif` `.wmf` `.emf`

### Excel / PowerPoint (표준 Office 스펙)

**Excel:** `.xls` `.xlsx` `.xlsm` `.xlsb` `.xlt` `.xltx` `.xltm` `.csv` `.ods` `.slk` `.dif`  
**PowerPoint:** `.ppt` `.pptx` `.pptm` `.pps` `.ppsx` `.ppsm` `.pot` `.potx` `.potm` `.odp`

### 기타 Office 앱

| 앱 | 주요 확장자 |
|----|-------------|
| Publisher | `.pub` |
| Visio | `.vsd` `.vsdx` `.vss` `.vst` |
| Access | `.mdb` `.accdb` |
| OneNote | `.one` `.onetoc2` |
| PDF | `.pdf` (뷰어/인쇄) |

---

## 4. lofice 구현 매핑

| MS Office 경로 | lofice 모듈 | 기술 |
|----------------|-------------|------|
| OFFXML + WWLIB | `parsers/docx.ts` | mammoth (DOCX/DOCM/DOTX) |
| GKExcel | `parsers/xlsx.ts` | SheetJS (XLS/XLSX/XLSM/ODS) |
| PPCORE | `parsers/pptx.ts` | JSZip + XML (PPTX/ODP) |
| RTFHTML | `parsers/rtf.ts` | RTF → HTML |
| VVIEWER (PDF) | `lib/pdf/pdf-engine.ts` | pdfjs-dist |
| OIS | `parsers/document-router` image | Blob URL |
| Wordconv (ODT) | `parsers/odf.ts` | ODF XML → HTML |
| MHT 필터 | `parsers/mhtml.ts` | MIME multipart 파싱 |
| HWP (한국) | `parsers/hancom.ts` | hwpxjs |

### 제한적 지원 (메타데이터 + 텍스트 추출)

`.pub` `.vsd` `.vsdx` `.mdb` `.accdb` `.one` `.ppt`(바이너리) — 프로prietary 포맷, 뷰어 안내 표시

---

## 5. 참고

- MS Office 소스/DLL **역공학·복제는 불가** (라이선스). lofice는 **동일 UX·형식 목록**을 오픈소스로 구현합니다.
- 고품질 HWP: [`@rhwp/core`](https://github.com/sechan9999/rhwp) 통합 권장
- 고품질 DOCX 편집: [`@eigenpal/docx-js-editor`](https://github.com/eigenpal/docx-editor) 통합 권장
