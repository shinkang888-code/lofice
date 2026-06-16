import type { Metadata, Viewport } from "next";
import CapacitorProvider from "@/components/CapacitorProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "LAWBOX - 통합 문서 뷰어 & 편집기",
  description: "PDF, HWP, Word, Excel, Markdown, HTML, 이미지 등 거의 모든 문서를 브라우저에서 열람·편집",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/lawbox-icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/lawbox-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LAWBOX",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#003377",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen">
        <CapacitorProvider>{children}</CapacitorProvider>
      </body>
    </html>
  );
}
