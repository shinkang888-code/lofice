"use client";

import { useEffect, useState } from "react";
import type { DocumentType } from "@/types/document";
import { parseHwpx } from "@/lib/parsers/hwpx";
import { parseDocxToHtml } from "@/lib/parsers/docx";
import { parseXlsx } from "@/lib/parsers/xlsx";
import HwpxViewer from "./HwpxViewer";
import DocxViewer from "./DocxViewer";
import XlsxViewer from "./XlsxViewer";
import PdfViewer from "./PdfViewer";
import TxtViewer from "./TxtViewer";
import { Loader2 } from "lucide-react";

interface Props {
  buffer: ArrayBuffer;
  fileName: string;
  fileType: DocumentType;
}

export default function DocumentViewer({ buffer, fileName, fileType }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hwpx, setHwpx] = useState<Awaited<ReturnType<typeof parseHwpx>> | null>(null);
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const [xlsx, setXlsx] = useState<Awaited<ReturnType<typeof parseXlsx>> | null>(null);
  const [txt, setTxt] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        switch (fileType) {
          case "hwpx":
            setHwpx(await parseHwpx(buffer));
            break;
          case "docx":
            setDocxHtml(await parseDocxToHtml(buffer));
            break;
          case "xlsx":
            setXlsx(parseXlsx(buffer));
            break;
          case "pdf":
            url = URL.createObjectURL(new Blob([buffer], { type: "application/pdf" }));
            setPdfUrl(url);
            break;
          case "txt":
            setTxt(new TextDecoder().decode(buffer));
            break;
          default:
            setError(`지원하지 않는 형식입니다: ${fileName}`);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "문서를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [buffer, fileType, fileName]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        <p className="text-sm text-gray-500">문서 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2 px-4">
        <p className="text-red-500 font-medium">오류</p>
        <p className="text-sm text-gray-500 text-center">{error}</p>
      </div>
    );
  }

  if (fileType === "hwpx" && hwpx) return <HwpxViewer content={hwpx} />;
  if (fileType === "docx" && docxHtml) return <DocxViewer html={docxHtml} />;
  if (fileType === "xlsx" && xlsx) return <XlsxViewer content={xlsx} />;
  if (fileType === "pdf" && pdfUrl) return <PdfViewer url={pdfUrl} />;
  if (fileType === "txt" && txt !== null) return <TxtViewer text={txt} />;

  return null;
}
