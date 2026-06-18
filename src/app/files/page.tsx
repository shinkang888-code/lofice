import type { Metadata } from "next";
import LofficeDocumentsPage from "@/components/portal/LofficeDocumentsPage";

export const metadata: Metadata = {
  title: "내 문서 — Loffice",
  description: "브라우저에 저장된 문서 목록 및 열기",
};

export default function FilesPage() {
  return <LofficeDocumentsPage />;
}
