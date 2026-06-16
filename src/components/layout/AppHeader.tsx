"use client";

import Link from "next/link";
import Image from "next/image";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 bg-lofice-navy text-white shadow-md safe-top border-b-2 border-lofice-gold">
      <div className="flex items-center gap-3 px-4 h-14">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/lofice-icon.png"
            alt="lofice"
            width={32}
            height={32}
            className="w-8 h-8 rounded-lg"
            priority
          />
          <div>
            <span className="font-bold text-lg leading-none text-lofice-gold">lofice</span>
            <span className="block text-[10px] text-white/70 leading-none mt-0.5">로피스 · 문서 뷰어 & 편집기</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
