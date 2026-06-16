"use client";

import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import DocumentConvertPanel from "@/components/convert/DocumentConvertPanel";
import { OTP_NAV } from "@/lib/officeTool/strings-ko";

export default function ConvertPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20">
      <AppHeader />
      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <h1 className="text-xl font-bold text-gray-900 mb-4">{OTP_NAV.convert}</h1>
        <DocumentConvertPanel />
      </main>
      <BottomNav />
    </div>
  );
}
