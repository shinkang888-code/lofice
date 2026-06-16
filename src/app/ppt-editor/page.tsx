"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { getFileLocal, updateFileLocal } from "@/lib/storage/local";
import { getDocumentType } from "@/lib/utils";
import { parsePresentation } from "@/lib/parsers/pptx";
import type { PptxSlide } from "@/lib/parsers/pptx";
import { ACCEPT_EXTENSIONS } from "@/lib/document-types";
import LoficeLayout from "@/components/office/LoficeLayout";
import PptSlideEditor from "@/components/ppt/PptSlideEditor";

const PptMasterEmbed = dynamic(() => import("@/components/ppt/PptMasterEmbed"), { ssr: false });

function PptEditorContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const mode = params.get("mode");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [slides, setSlides] = useState<PptxSlide[]>([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "gallery") {
      setLoading(false);
      return;
    }
    if (!id) { setError("문서 ID가 없습니다."); setLoading(false); return; }
    getFileLocal(id).then(async (file) => {
      if (!file) { setError("문서를 찾을 수 없습니다."); setLoading(false); return; }
      const type = getDocumentType(file.name);
      if (type !== "presentation") {
        setError("PPT/PPTX 파일만 편집할 수 있습니다.");
        setLoading(false);
        return;
      }
      try {
        const parsed = await parsePresentation(file.data, file.name);
        setSlides(parsed.slides);
        setFileName(file.name);
      } catch (e) {
        setError(e instanceof Error ? e.message : "PPT 파싱 실패");
      } finally {
        setLoading(false);
      }
    });
  }, [id, mode]);

  const handleSave = useCallback(async (buffer: ArrayBuffer, updatedSlides: PptxSlide[]) => {
    if (!id) return;
    const newName = fileName.toLowerCase().endsWith(".pptx") ? fileName : `${fileName.replace(/\.[^.]+$/, "")}.pptx`;
    await updateFileLocal(id, buffer, newName);
    setSlides(updatedSlides);
    setFileName(newName);
    router.push(`/viewer/?id=${id}`);
  }, [id, fileName, router]);

  const handleOpenFile = () => fileInputRef.current?.click();

  const handleNewFile = async (file: File) => {
    const { saveFileLocal } = await import("@/lib/storage/local");
    const newId = await saveFileLocal(file);
    router.push(`/ppt-editor/?id=${newId}`);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-400 bg-[#0d0d0f]">불러오는 중...</div>;
  }

  if (mode === "gallery") {
    return (
      <LoficeLayout fileName="PPT Master 갤러리" minimal pptEditMode viewerHref="/">
        <PptMasterEmbed projectId={params.get("project") ?? undefined} />
      </LoficeLayout>
    );
  }

  if (error || slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-red-400 bg-[#0d0d0f] px-4 text-center">
        {error ?? "슬라이드 없음"}
      </div>
    );
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_EXTENSIONS}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleNewFile(file);
          e.target.value = "";
        }}
      />
      <LoficeLayout
        fileName={fileName}
        onOpenFile={handleOpenFile}
        minimal
        pptEditMode
        viewerHref={id ? `/viewer/?id=${id}` : undefined}
      >
        <PptSlideEditor initialSlides={slides} fileName={fileName} onSave={id ? handleSave : undefined} />
      </LoficeLayout>
    </>
  );
}

export default function PptEditorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400">로딩...</div>}>
      <PptEditorContent />
    </Suspense>
  );
}
