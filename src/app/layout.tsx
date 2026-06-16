import type { Metadata, Viewport } from "next";
import CapacitorProvider from "@/components/CapacitorProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "OneOffice - 원오피스",
  description: "광고 없는 무료 문서 뷰어 & 오피스. HWPX, DOCX, XLSX, PDF 지원",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/oneoffice-app-icon.png", sizes: "512x512", type: "image/png" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/oneoffice-app-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "OneOffice",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563eb",
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
