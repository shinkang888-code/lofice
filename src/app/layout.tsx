import type { Metadata, Viewport } from "next";
import CapacitorProvider from "@/components/CapacitorProvider";
import PdfWorkerPreload from "@/components/pwa/PdfWorkerPreload";
import "./globals.css";

export const metadata: Metadata = {
  title: "lofice(로피스) - 통합 문서 뷰어 & 편집기",
  description: "PDF, HWP, Word, Excel, Markdown, HTML, 이미지 등 거의 모든 문서를 브라우저에서 열람·편집",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/lofice-icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/lofice-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "lofice",
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
        <CapacitorProvider>
          <PdfWorkerPreload />
          {children}
        </CapacitorProvider>
      </body>
    </html>
  );
}
