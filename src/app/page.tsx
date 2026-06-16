"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import FilePicker from "@/components/files/FilePicker";
import PwaInstallPrompt from "@/components/pwa/PwaInstallPrompt";
import { saveFileLocal } from "@/lib/storage/local";
import { FileText, Eye, Edit3, Shield, Scale } from "lucide-react";

const FORMATS = [
  "HWP", "HWPX", "DOCX", "XLSX", "PDF", "TXT", "MD", "HTML",
  "JSON", "XML", "JPG", "PNG", "GIF", "WEBP", "SVG",
];

export default function HomePage() {
  const router = useRouter();

  const handleFile = async (file: File) => {
    const id = await saveFileLocal(file);
    router.push(`/viewer/?id=${id}`);
  };

  const features = [
    { icon: Eye, title: "통합 뷰어", desc: "PDF·HWP·Word·이미지 등 열람" },
    { icon: Edit3, title: "다형식 편집", desc: "문서·표·MD·HTML·코드" },
    { icon: Shield, title: "광고 없음", desc: "완전 무료, 추적 제로" },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <AppHeader />
      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <section className="mb-8 flex items-center gap-4">
          <Image
            src="/lofice-icon.png"
            alt="lofice"
            width={64}
            height={64}
            className="w-16 h-16 rounded-xl shadow-md"
            priority
          />
          <div>
            <h1 className="text-2xl font-bold text-lofice-navy mb-1 flex items-center gap-2">
              <Scale className="w-6 h-6 text-lofice-gold" />
              lofice
            </h1>
            <p className="text-gray-500 text-sm">lofice(로피스) — 웹 기반 통합 문서 뷰어 & 편집기</p>
          </div>
        </section>

        <PwaInstallPrompt />
        <FilePicker onFileSelect={handleFile} />

        <section className="mt-8 grid grid-cols-3 gap-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-3 border border-gray-100 text-center shadow-sm">
              <Icon className="w-5 h-5 text-lofice-navy mx-auto mb-2" />
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
            {FORMATS.map((fmt) => (
              <span key={fmt} className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-[10px] text-gray-600 font-medium">
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

