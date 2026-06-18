"use client";

import { useRef } from "react";
import Link from "next/link";
import { FolderOpen, Sparkles } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { saveFileLocal } from "@/lib/storage/local";
import { isSupportedFile, ACCEPT_EXTENSIONS } from "@/lib/document-types";
import { useRouter } from "next/navigation";
import "../home/lofice-nova-home.css";

const FORMAT_BADGES = ["HWP", "PDF", "AI", "DOC", "PPT"];

export default function LofficeNovaHome() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFile = async (file: File) => {
    if (!isSupportedFile(file)) {
      alert("지원하지 않는 형식입니다.");
      return;
    }
    const id = await saveFileLocal(file);
    router.push(`/viewer/?id=${id}`);
  };

  return (
    <PortalShell active="home">
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_EXTENSIONS}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      <main className="nova-home-main nova-home-main--in-portal">
        <div className="nova-home-badges">
          {FORMAT_BADGES.map((b) => (
            <span key={b} className="nova-home-badge">
              {b}
            </span>
          ))}
        </div>
        <p className="nova-home-eyebrow">LOFFICE AI</p>
        <h1 className="nova-home-title">브라우저 하나로 모든 문서 업무를</h1>
        <p className="nova-home-sub">
          HWP · Office · PDF · AI — 설치 없이 바로 시작하는 글로벌 오피스
        </p>

        <div className="nova-home-actions">
          <Link href="/office-tools/" className="nova-home-primary-btn">
            <Sparkles className="size-4" />
            오피스 툴즈 · AI Studio
          </Link>
          <button type="button" className="nova-home-doc-btn" onClick={openFilePicker}>
            <FolderOpen className="size-4" />
            문서 열기
          </button>
        </div>
        <p className="nova-home-doc-note">HWP · DOCX · XLSX · PPTX · PDF · ZIP · 7Z</p>
      </main>

      <footer className="nova-home-footer">
        <p>© {new Date().getFullYear()} Loffice · Powered by LoBooK AI Studio</p>
      </footer>
    </PortalShell>
  );
}
