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
    <div className="flex flex-col min-h-screen pb-20">
      <AppHeader />
      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <h1 className="text-xl font-bold text-gray-900 mb-4">내 문서</h1>
        <div className="mb-6">
          <FilePicker onFileSelect={handleFile} />
        </div>
        <FileList />
      </main>
      <BottomNav />
    </div>
  );
}
