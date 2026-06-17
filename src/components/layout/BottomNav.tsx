"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderOpen, Wrench, Settings } from "lucide-react";
import { OTP_NAV } from "@/lib/officeTool/strings-ko";

const tabs = [
  { href: "/", icon: Home, label: OTP_NAV.home },
  { href: "/files/", icon: FolderOpen, label: "문서" },
  { href: "/toolbox/", icon: Wrench, label: OTP_NAV.toolbox },
  { href: "/settings/", icon: Settings, label: OTP_NAV.settings },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/[0.06] bg-white/90 backdrop-blur-xl safe-bottom">
      <div className="flex justify-around items-center h-[3.25rem] max-w-lg mx-auto">
        {tabs.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[4rem] min-h-[2.75rem] rounded-lg transition-colors ${
                active ? "text-[#003377]" : "text-gray-400"
              }`}
            >
              <Icon className="w-[22px] h-[22px]" strokeWidth={active ? 2.25 : 2} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
