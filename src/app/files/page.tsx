"use client";

import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import FileList from "@/components/files/FileList";
import FilePicker from "@/components/files/FilePicker";
import { useRouter } from "next/navigation";
import { saveFileLocal } from "@/lib/storage/local";

export default function FilesPage() {
  const router = useRouter();

  const handleFile = async (file: File) => {
    const id = await saveFileLocal(file);
    router.push(`/viewer/?id=${id}`);
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#f2f2f7] pb-20">
      <AppHeader />
      <main className="flex-1 px-4 py-5 max-w-lg mx-auto w-full">
        <h1 className="text-[1.375rem] font-bold tracking-tight text-gray-900 mb-1">내 문서</h1>
        <p className="text-sm text-gray-500 mb-5">열기 · 미리보기 · 편집</p>
        <div className="mb-5">
          <FilePicker onFileSelect={handleFile} />
        </div>
        <FileList />
      </main>
      <BottomNav />
    </div>
  );
}
