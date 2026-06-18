import type { Metadata } from "next";
import LofficeNovaHome from "@/components/home/LofficeNovaHome";

export const metadata: Metadata = {
  title: "Loffice — 무료 온라인 문서 뷰어 & 편집 도구",
  description:
    "설치 없이 브라우저에서 바로 시작하는 문서 뷰어·편집 도구. Loffice AI Studio로 PPT·문서를 Gemini와 함께 생성하세요.",
  openGraph: {
    title: "Loffice — 무료 온라인 문서 도구",
    description: "HWP · Office · PDF · AI — Loffice AI Studio",
  },
};

export default function HomePage() {
  return <LofficeNovaHome />;
}
