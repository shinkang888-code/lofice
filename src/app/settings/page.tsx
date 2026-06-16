import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { Shield, Smartphone, Cloud, Ban } from "lucide-react";

export default function SettingsPage() {
  const items = [
    { icon: Shield, title: "광고 없음", desc: "OneOffice는 광고나 추적 코드를 포함하지 않습니다." },
    { icon: Ban, title: "텔레메트리 없음", desc: "사용 데이터를 수집하거나 전송하지 않습니다." },
    { icon: Smartphone, title: "오프라인 지원", desc: "문서는 기기에 로컬 저장됩니다." },
    { icon: Cloud, title: "클라우드 (선택)", desc: "Supabase 설정 시 클라우드 동기화 가능" },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <AppHeader />
      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <h1 className="text-xl font-bold text-gray-900 mb-6">설정</h1>
        <div className="space-y-3">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-3 p-4 bg-white rounded-xl border border-gray-100">
              <Icon className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800 text-sm">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>OneOffice (원오피스) v0.1.0</p>
          <p className="mt-1">광고 없는 무료 오피스</p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
