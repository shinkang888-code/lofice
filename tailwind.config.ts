import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        lofice: {
          navy: "#003377",
          gold: "#D4AF37",
          ribbon: "#1a4a7a",
        },
        brand: {
          50: "#e8eef5", 100: "#c5d4e8", 200: "#9eb8d9",
          300: "#779bca", 400: "#4f7ebb", 500: "#003377",
          600: "#002d6a", 700: "#00245a", 800: "#001b4a", 900: "#00123a",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          foreground: "var(--gold-foreground)",
        },
      },
      boxShadow: {
        "lo-card": "var(--shadow-card)",
        "lo-glow": "var(--shadow-glow)",
      },
    },
  },
  plugins: [],
};
export default config;
