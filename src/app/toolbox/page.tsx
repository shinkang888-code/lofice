"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import OfficeToolboxPanel from "@/components/toolbox/OfficeToolboxPanel";
import HashCheckerPanel from "@/components/toolbox/HashCheckerPanel";
import { OTP_NAV } from "@/lib/officeTool/strings-ko";

function ToolboxContent() {
  const params = useSearchParams();
  const tab = params.get("tab");

  return (
    <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-8">
      <h1 className="text-xl font-bold text-gray-900">{OTP_NAV.toolbox}</h1>
      {tab === "hash" ? <HashCheckerPanel /> : <OfficeToolboxPanel />}
      {tab === "hash" && (
        <div className="pt-4 border-t border-gray-100">
          <OfficeToolboxPanel />
        </div>
      )}
    </main>
  );
}

export default function ToolboxPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20">
      <AppHeader />
      <Suspense fallback={<div className="p-6 text-gray-400 text-sm">로딩…</div>}>
        <ToolboxContent />
      </Suspense>
      <BottomNav />
    </div>
  );
}
