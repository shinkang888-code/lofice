/**
 * TypeScript-React-Conversion-Guide 패턴 — 도메인 string literal types
 * @see https://github.com/shinkang888-code/TypeScript-React-Conversion-Guide
 */

/** TicTacToe GameState 패턴 → 문서 로드 상태 */
export type DocumentLoadState = "" | "loading" | "ready" | "error";

/** PPT AI 생성 엔진 출처 */
export type PptGenerationSource =
  | ""
  | "openai"
  | "heuristic"
  | "builtin"
  | "pptxgenjs"
  | "powerpoint-gem"
  | "gpt-generator"
  | "mcp-template";

/** 앱 테마 (ThemeProvider 연동) */
export type LoficeThemeMode = "light" | "dark" | "system";

/** 문서 편집 모드 */
export type DocumentEditMode = "view" | "edit" | "present";
