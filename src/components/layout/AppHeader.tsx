"use client";

import Link from "next/link";
import Image from "next/image";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 bg-lawbox-navy text-white shadow-md safe-top border-b-2 border-lawbox-gold">
      <div className="flex items-center gap-3 px-4 h-14">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/lawbox-icon.png"
            alt="LAWBOX"
            width={32}
            height={32}
            className="w-8 h-8 rounded-lg"
            priority
          />
          <div>
            <span className="font-bold text-lg leading-none text-lawbox-gold">LAWBOX</span>
            <span className="block text-[10px] text-white/70 leading-none mt-0.5">문서 뷰어 & 편집기</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
