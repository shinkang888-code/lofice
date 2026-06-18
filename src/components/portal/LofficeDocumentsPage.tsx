"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { CloudUpload } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import FileList from "@/components/files/FileList";
import { saveFileLocal } from "@/lib/storage/local";
import { isSupportedFile, ACCEPT_EXTENSIONS } from "@/lib/document-types";
import "./documents-page.css";

export default function LofficeDocumentsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!isSupportedFile(file)) {
      alert("지원하지 않는 형식입니다.");
      return;
    }
    const id = await saveFileLocal(file);
    router.push(`/viewer/?id=${id}`);
  };

  return (
    <PortalShell active="docs">
      <main className="portal-page-main documents-page">
        <div className="documents-toolbar">
          <button
            type="button"
            className="documents-upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudUpload className="size-4" />
            파일 추가
          </button>
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
        </div>

        <section className="documents-list-wrap portal-card">
          <FileList />
        </section>
      </main>
    </PortalShell>
  );
}
