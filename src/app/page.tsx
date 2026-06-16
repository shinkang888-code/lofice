import type { Metadata } from "next";
import LofficeLandingPage from "@/components/home/LofficeLandingPage";

export const metadata: Metadata = {
  title: "Loffice — 무료 온라인 문서 뷰어 & 편집 도구",
  description:
    "설치 없이 브라우저에서 바로 시작하는 문서 뷰어·편집 도구. PDF, Word, Excel, PowerPoint, 한글까지 한 곳에서.",
  openGraph: {
    title: "Loffice — 무료 온라인 문서 도구",
    description: "설치 없이 브라우저에서 바로 쓰는 올인원 문서 뷰어·편집 도구.",
  },
};

export default function HomePage() {
  return <LofficeLandingPage />;
}
