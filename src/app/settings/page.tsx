import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import DefaultAppGuide from "@/components/settings/DefaultAppGuide";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import SettingsIoPanel from "@/components/settings/SettingsIoPanel";
import ProSettingsSection from "@/components/settings/ProSettingsSection";
import Link from "next/link";
import { Shield, Smartphone, Cloud, Ban, RefreshCw, Hash, Lock, ArrowRightLeft, Sparkles } from "lucide-react";
import { OTP_NAV } from "@/lib/officeTool/strings-ko";
import { DEFAULT_PREFERENCES } from "@/lib/officeTool/preferences";

export default function SettingsPage() {
  const items = [
    { icon: Shield, title: "광고 없음", desc: "lofice는 광고나 추적 코드를 포함하지 않습니다." },
    { icon: Ban, title: "텔레메트리 없음", desc: "사용 데이터를 수집하거나 전송하지 않습니다." },
    { icon: Smartphone, title: "오프라인 지원", desc: "문서는 기기에 로컬 저장됩니다." },
    { icon: Cloud, title: "클라우드 (선택)", desc: "Supabase 설정 시 클라우드 동기화 가능" },
  ];

  const tools = [
    { href: "/pro/", icon: Sparkles, label: "lofice Pro" },
    { href: "/migrate/", icon: ArrowRightLeft, label: "Office → lofice" },
    { href: "/convert/", icon: RefreshCw, label: OTP_NAV.convert },
    { href: "/office-crypto/", icon: Lock, label: "Office 암·복호화" },
    { href: "/toolbox/?tab=hash", icon: Hash, label: OTP_NAV.hashChecker },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <AppHeader />
      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-6">
        <h1 className="text-xl font-bold text-gray-900">{OTP_NAV.settings}</h1>
        <AppearanceSettings />
        <ProSettingsSection />
        <SettingsIoPanel />
        <DefaultAppGuide />
        <section>
          <h2 className="text-sm font-semibold text-gray-800 mb-2">도구</h2>
          <div className="grid grid-cols-2 gap-2">
            {tools.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-100 text-sm text-gray-800"
              >
                <Icon className="w-4 h-4 text-[#2b579a]" />
                {label}
              </Link>
            ))}
          </div>
        </section>
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
        <div className="text-center text-xs text-gray-400">
          <p>lofice v{DEFAULT_PREFERENCES.version}</p>
          <p className="mt-1">웹 기반 통합 문서 뷰어 & 편집기 · Office Tool Plus 패턴</p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
