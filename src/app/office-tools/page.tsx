import type { Metadata } from "next";
import OfficeToolsPage from "@/components/portal/OfficeToolsPage";

export const metadata: Metadata = {
  title: "오피스 툴즈 — Loffice",
  description: "Loffice AI Studio와 PDF·HWP·Office 편집 도구 허브",
};

export default function Page() {
  return <OfficeToolsPage />;
}
