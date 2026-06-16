/**
 * PptxGenJS 테마 — defineSlideMaster / 컬러 스킴
 * @see https://github.com/shinkang888-code/PptxGenJS
 */
export type PptxGenThemeId = "office_blue" | "dark_modern" | "bright_modern" | "minimal";

export type PptxGenTheme = {
  id: PptxGenThemeId;
  label: string;
  titleColor: string;
  bodyColor: string;
  accentColor: string;
  bgColor: string;
};

export const PPTXGEN_THEMES: PptxGenTheme[] = [
  { id: "office_blue", label: "Office Blue", titleColor: "2B579A", bodyColor: "363636", accentColor: "5B8DEF", bgColor: "FFFFFF" },
  { id: "dark_modern", label: "Dark Modern", titleColor: "FFA500", bodyColor: "FFFFFF", accentColor: "FF8C00", bgColor: "1A1A2E" },
  { id: "bright_modern", label: "Bright Modern", titleColor: "FF1493", bodyColor: "333333", accentColor: "FF69B4", bgColor: "FFF8F0" },
  { id: "minimal", label: "Minimal", titleColor: "111111", bodyColor: "444444", accentColor: "666666", bgColor: "FFFFFF" },
];

export function getPptxGenTheme(id: PptxGenThemeId): PptxGenTheme {
  return PPTXGEN_THEMES.find((t) => t.id === id) ?? PPTXGEN_THEMES[0]!;
}
