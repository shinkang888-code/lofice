"use client";

import { Smartphone, ExternalLink } from "lucide-react";
import { isNativeApp } from "@/lib/capacitor";
import { SUPPORTED_EXTENSIONS } from "@/lib/document-types";

export default function DefaultAppGuide() {
  const isAndroid = isNativeApp();

  const openDefaultSettings = () => {
    const bridge = (window as Window & { LoficeAndroid?: { openDefaultAppSettings: () => void } }).LoficeAndroid;
    if (bridge?.openDefaultAppSettings) {
      bridge.openDefaultAppSettings();
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-100 space-y-3">
      <div className="flex gap-3">
        <Smartphone className="w-5 h-5 text-lofice-navy shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-gray-800 text-sm">연결 프로그램 (기본 앱)</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            lofice를 설치한 뒤 파일을 열 때 <strong>항상 lofice</strong>를 선택하면
            PDF·HWP·Word·이미지 등이 lofice 아이콘으로 열립니다.
          </p>
        </div>
      </div>

      <ol className="text-xs text-gray-600 space-y-1.5 list-decimal list-inside bg-gray-50 rounded-lg p-3">
        <li>파일 관리자에서 문서를 탭합니다</li>
        <li>앱 선택 창에서 <strong>lofice</strong> 선택</li>
        <li><strong>항상</strong> 또는 <strong>기본값으로 설정</strong> 선택</li>
      </ol>

      {isAndroid && (
        <button
          type="button"
          onClick={openDefaultSettings}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-lofice-navy text-white text-xs font-semibold rounded-lg"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          기본 앱 설정 열기
        </button>
      )}

      <p className="text-[10px] text-gray-400">
        지원 형식: {SUPPORTED_EXTENSIONS.slice(0, 12).join(", ")}… 등 {SUPPORTED_EXTENSIONS.length}종
      </p>
    </div>
  );
}
