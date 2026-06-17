"use client";

import { AlertCircle } from "lucide-react";
import { EXT_TO_FORMAT } from "@/lib/msoffice/format-registry";
import { getProRecommendReason } from "@/lib/pro/detect";
import ProSuggestBanner from "@/components/pro/ProSuggestBanner";

interface Props {
  fileName: string;
  ext: string;
  localId?: string;
}

export default function UnsupportedViewer({ fileName, ext, localId }: Props) {
  const proReason = getProRecommendReason(fileName);
  if (proReason) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-6 bg-[#f3f3f3]">
        <ProSuggestBanner fileName={fileName} localId={localId} className="max-w-md w-full" />
        <p className="text-xs text-gray-500 text-center">
          변환 후 다시 열면 뷰어·편집기에서 사용할 수 있습니다.
        </p>
      </div>
    );
  }

  const info = EXT_TO_FORMAT[ext.toLowerCase()];
  const app = info?.app ?? "viewer";
  const label = info?.label ?? ext.toUpperCase();

  const appNames: Record<string, string> = {
    publisher: "Microsoft Publisher (MSPUB.EXE + PUBCONV.DLL)",
    visio: "Microsoft Visio (VVIEWER.DLL)",
    access: "Microsoft Access (MSACCESS.EXE + ACEDAO.DLL)",
    onenote: "Microsoft OneNote (ONFILTER.DLL)",
    outlook: "Microsoft Outlook (OUTLFLTR.DLL)",
    viewer: "Office Viewer",
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-6 bg-[#f3f3f3]">
      <AlertCircle className="w-12 h-12 text-amber-500" />
      <p className="text-lg font-semibold text-gray-800">{label} 형식</p>
      <p className="text-sm text-gray-600 text-center max-w-md">
        <strong>{fileName}</strong>
        <br />
        MS Office에서는 <em>{appNames[app] ?? "Office"}</em>로 열 수 있는 형식입니다.
        <br />
        lofice는 현재 이 형식의 전용 뷰어를 지원하지 않습니다.
      </p>
      <p className="text-xs text-gray-400">
        .pptx · .docx · .xlsx · .pdf · .hwp 등 60+ 형식은 지원됩니다.
      </p>
    </div>
  );
}
