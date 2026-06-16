/** Office-PowerPoint-MCP-Server v2.0 color schemes */
export type PptColorSchemeId =
  | "modern_blue"
  | "corporate_gray"
  | "elegant_green"
  | "warm_red"
  | "pastel_dream"
  | "nature_earth"
  | "neon_vibrant"
  | "minimalist_mono";

export type PptColorScheme = {
  id: PptColorSchemeId;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  gradient: string;
};

function rgb(c: [number, number, number]): string {
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

export const PPT_COLOR_SCHEMES: PptColorScheme[] = [
  {
    id: "modern_blue",
    label: "Modern Blue",
    primary: rgb([0, 120, 215]),
    secondary: rgb([40, 40, 40]),
    accent: rgb([0, 176, 240]),
    text: rgb([68, 68, 68]),
    gradient: "linear-gradient(135deg, rgb(0,176,240), rgb(0,120,215))",
  },
  {
    id: "corporate_gray",
    label: "Corporate Gray",
    primary: rgb([68, 68, 68]),
    secondary: rgb([0, 120, 215]),
    accent: rgb([89, 89, 89]),
    text: rgb([51, 51, 51]),
    gradient: "linear-gradient(135deg, rgb(217,217,217), rgb(89,89,89))",
  },
  {
    id: "elegant_green",
    label: "Elegant Green",
    primary: rgb([70, 136, 71]),
    secondary: rgb([255, 255, 255]),
    accent: rgb([146, 208, 80]),
    text: rgb([89, 89, 89]),
    gradient: "linear-gradient(135deg, rgb(146,208,80), rgb(70,136,71))",
  },
  {
    id: "warm_red",
    label: "Warm Red",
    primary: rgb([192, 80, 77]),
    secondary: rgb([68, 68, 68]),
    accent: rgb([230, 126, 34]),
    text: rgb([44, 62, 80]),
    gradient: "linear-gradient(135deg, rgb(241,196,15), rgb(192,80,77))",
  },
  {
    id: "pastel_dream",
    label: "Pastel Dream",
    primary: rgb([156, 136, 255]),
    secondary: rgb([255, 154, 162]),
    accent: rgb([255, 206, 147]),
    text: rgb([88, 88, 88]),
    gradient: "linear-gradient(135deg, rgb(255,206,147), rgb(156,136,255))",
  },
  {
    id: "nature_earth",
    label: "Nature Earth",
    primary: rgb([101, 123, 131]),
    secondary: rgb([162, 132, 94]),
    accent: rgb([143, 151, 121]),
    text: rgb([68, 68, 68]),
    gradient: "linear-gradient(135deg, rgb(218,215,205), rgb(101,123,131))",
  },
  {
    id: "neon_vibrant",
    label: "Neon Vibrant",
    primary: rgb([255, 20, 147]),
    secondary: rgb([0, 191, 255]),
    accent: rgb([57, 255, 20]),
    text: rgb([34, 34, 34]),
    gradient: "linear-gradient(135deg, rgb(255,20,147), rgb(0,191,255))",
  },
  {
    id: "minimalist_mono",
    label: "Minimalist Mono",
    primary: rgb([34, 34, 34]),
    secondary: rgb([128, 128, 128]),
    accent: rgb([68, 68, 68]),
    text: rgb([51, 51, 51]),
    gradient: "linear-gradient(135deg, rgb(250,250,250), rgb(187,187,187))",
  },
];

export function getColorScheme(id: PptColorSchemeId): PptColorScheme {
  return PPT_COLOR_SCHEMES.find((s) => s.id === id) ?? PPT_COLOR_SCHEMES[0]!;
}
