/** PowerPoint-Generator-Python-Project 테마 */
export type PptGeneratorThemeId = "dark_modern" | "bright_modern" | "classic";

export type PptGeneratorTheme = {
  id: PptGeneratorThemeId;
  label: string;
  titleColor: string;
  bodyColor: string;
  fontFamily: string;
};

export const PPT_GENERATOR_THEMES: PptGeneratorTheme[] = [
  { id: "dark_modern", label: "Dark Modern", titleColor: "#ffa500", bodyColor: "#ffffff", fontFamily: "Times New Roman" },
  { id: "bright_modern", label: "Bright Modern", titleColor: "#ff1493", bodyColor: "#000000", fontFamily: "Arial" },
  { id: "classic", label: "Classic", titleColor: "#003366", bodyColor: "#000000", fontFamily: "Arial" },
];
