"use client";

import Link from "next/link";
import Image from "next/image";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 bg-brand-600 text-white shadow-md safe-top">
      <div className="flex items-center gap-3 px-4 h-14">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/oneoffice-app-icon.png"
            alt="OneOffice"
            width={32}
            height={32}
            className="w-8 h-8 rounded-lg"
            priority
          />
          <div>
            <span className="font-bold text-lg leading-none">OneOffice</span>
            <span className="block text-[10px] text-brand-200 leading-none mt-0.5">원오피스</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
