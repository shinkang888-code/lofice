"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useCallback, type DragEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { saveFileLocal } from "@/lib/storage/local";
import { isSupportedFile, ACCEPT_EXTENSIONS } from "@/lib/document-types";
import PolarisOpenButton from "@/components/home/PolarisOpenButton";
import PolarisAppTiles from "@/components/home/PolarisAppTiles";
import RecentDocuments from "@/components/home/RecentDocuments";
import { Settings, FolderOpen } from "lucide-react";

export default function PolarisHomePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const openFilePicker = useCallback(() => fileInputRef.current?.click(), []);

  const handleFile = async (file: File) => {
    if (!isSupportedFile(file)) {
      alert("지원하지 않는 형식입니다.");
      return;
    }
    const id = await saveFileLocal(file);
    router.push(`/viewer/?id=${id}`);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`polaris-home min-h-screen flex flex-col ${dragging ? "polaris-dragging" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_EXTENSIONS}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      <header className="flex items-center justify-between px-4 py-3 safe-top">
        <div className="flex items-center gap-2">
          <Image src="/lofice-icon.png" alt="lofice" width={32} height={32} className="w-8 h-8 rounded-lg" priority />
          <div>
            <span className="font-bold text-white text-lg">lofice</span>
            <span className="text-[10px] text-white/60 ml-1.5">로피스 웹 오피스</span>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <Link href="/files/" className="p-2 text-white/80 hover:bg-white/10 rounded-lg" title="내 문서">
            <FolderOpen className="w-5 h-5" />
          </Link>
          <Link href="/settings/" className="p-2 text-white/80 hover:bg-white/10 rounded-lg" title="설정">
            <Settings className="w-5 h-5" />
          </Link>
        </nav>
      </header>

      <main className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full">
        <section className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            브라우저에서 무료로 사용하는
            <br />
            <span className="text-lofice-gold">한글 · 시트 · 워드 · PDF</span>
          </h1>
          <p className="text-sm text-white/70 max-w-md mx-auto">
            설치 없이 HWP, Word, Excel, PDF를 열고 편집하세요.
            폴라리스 오피스 웹 수준의 리본 UI를 제공합니다.
          </p>
        </section>

        <div className="flex flex-col items-center mb-10">
          <PolarisOpenButton onOpen={openFilePicker} />
        </div>

        <PolarisAppTiles onOpen={openFilePicker} />
        <RecentDocuments />

        <p className="text-center text-[10px] text-white/40 mt-12">
          광고 없음 · 추적 없음 · 오프라인 저장 지원
        </p>
      </main>
    </div>
  );
}
