"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ArchivePanel from "@/components/archive/ArchivePanel";
import LoficeLayout from "@/components/office/LoficeLayout";
import { getFileLocal, saveFileLocal } from "@/lib/storage/local";

function ArchivePageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getFileLocal(id).then((file) => {
      if (file) {
        setBuffer(file.data);
        setFileName(file.name);
      }
      setLoading(false);
    });
  }, [id]);

  const handleOpen = useCallback(
    async (file: File) => {
      const newId = await saveFileLocal(file);
      router.push(`/archive/?id=${newId}`);
    },
    [router],
  );

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-400">불러오는 중…</div>;
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".7z,.zip,.rar,.tar,.gz,.bz2,.xz,.tgz,.tbz2,.wim,.iso,.cab,.deb,.rpm"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleOpen(f);
          e.target.value = "";
        }}
      />
      <LoficeLayout
        fileName={fileName || "7-Zip 아카이브"}
        onOpenFile={() => fileInputRef.current?.click()}
        minimal
      >
        {buffer ? (
          <ArchivePanel buffer={buffer} fileName={fileName} className="h-full" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3 px-4 text-center">
            <p className="text-sm">7z · ZIP · RAR · TAR · GZIP · XZ · WIM · ISO · CAB · DEB · RPM</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-[#2b579a] text-white text-sm rounded-lg"
            >
              아카이브 열기
            </button>
          </div>
        )}
      </LoficeLayout>
    </>
  );
}

export default function ArchivePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400">로딩...</div>}>
      <ArchivePageContent />
    </Suspense>
  );
}
