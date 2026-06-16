"use client";

import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import OfficeCryptoPanel from "@/components/msoffice/OfficeCryptoPanel";

export default function OfficeCryptoPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20">
      <AppHeader />
      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Office 암·복호화</h1>
        <p className="text-xs text-gray-500 mb-4">Word · Excel · PowerPoint 비밀번호 보호</p>
        <OfficeCryptoPanel />
      </main>
      <BottomNav />
    </div>
  );
}
