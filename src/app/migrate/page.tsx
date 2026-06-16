"use client";

import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import OfficeMigrationPanel from "@/components/msoffice/OfficeMigrationPanel";

export default function MigratePage() {
  return (
    <div className="flex flex-col min-h-screen pb-20">
      <AppHeader />
      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Office → lofice</h1>
        <p className="text-xs text-gray-500 mb-4">Microsoft Office 제거 · lofice 마이그레이션</p>
        <OfficeMigrationPanel />
      </main>
      <BottomNav />
    </div>
  );
}
