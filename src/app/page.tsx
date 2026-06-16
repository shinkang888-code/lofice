"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import FilePicker from "@/components/files/FilePicker";
import { saveFileLocal } from "@/lib/storage/local";
import { FileText, Eye, Edit3, Shield } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  const handleFile = async (file: File) => {
    const id = await saveFileLocal(file);
    router.push(`/viewer/?id=${id}`);
  };

  const features = [
    { icon: Eye, title: "빠른 뷰어", desc: "HWPX, DOCX, XLSX, PDF 즉시 열람" },
    { icon: Edit3, title: "간편 편집", desc: "문서·스프레드시트 기본 편집" },
    { icon: Shield, title: "광고 없음", desc: "완전 무료, 추적·광고 제로" },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <AppHeader />
      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <section className="mb-8 flex items-center gap-4">
          <Image
            src="/oneoffice-logo.png"
            alt="OneOffice"
            width={64}
            height={64}
            className="w-16 h-16 rounded-2xl shadow-sm"
            priority
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">문서를 열어보세요</h1>
            <p className="text-gray-500 text-sm">기기에서 바로 읽고 편집할 수 있습니다</p>
          </div>
        </section>

        <FilePicker onFileSelect={handleFile} />

        <section className="mt-8 grid grid-cols-3 gap-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <Icon className="w-5 h-5 text-brand-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-800">{title}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{desc}</p>
            </div>
          ))}
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" /> 지원 형식
          </h2>
          <div className="flex flex-wrap gap-2">
            {["HWPX", "DOCX", "XLSX", "PDF", "TXT"].map((fmt) => (
              <span key={fmt} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 font-medium">
                .{fmt.toLowerCase()}
              </span>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
