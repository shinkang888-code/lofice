"use client";

import { useEffect, useState } from "react";
import type { DocumentType, XlsxContent } from "@/types/document";
import { parseDocument } from "@/lib/parsers/document-router";
import HangulViewer from "./HangulViewer";
import DocxViewer from "./DocxViewer";
import XlsxViewer from "./XlsxViewer";
import PdfViewer from "./PdfViewer";
import TxtViewer from "./TxtViewer";
import ImageViewer from "./ImageViewer";
import MarkdownViewer from "./MarkdownViewer";
import HtmlViewer from "./HtmlViewer";
import CodeViewer from "./CodeViewer";
import { Loader2 } from "lucide-react";

interface Props {
  buffer: ArrayBuffer;
  fileName: string;
  fileType: DocumentType;
}

export default function DocumentViewer({ buffer, fileName, fileType }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [xlsx, setXlsx] = useState<XlsxContent | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string | undefined>();
  const [code, setCode] = useState<string | null>(null);
  const [codeLanguage, setCodeLanguage] = useState<"json" | "xml" | "text">("text");
  const [resolvedType, setResolvedType] = useState<DocumentType>(fileType);

  useEffect(() => {
    let pdf: string | null = null;
    let img: string | null = null;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await parseDocument(buffer, fileName, fileType);
        setResolvedType(result.type);
        setHtml(result.html ?? null);
        setText(result.text ?? null);
        setXlsx(result.xlsx ?? null);
        if (result.pdfUrl) {
          pdf = result.pdfUrl;
          setPdfUrl(result.pdfUrl);
        }
        if (result.imageUrl) {
          img = result.imageUrl;
          setImageUrl(result.imageUrl);
          setImageMime(result.imageMime);
        }
        if (result.code) {
          setCode(result.code);
          setCodeLanguage(result.codeLanguage ?? "text");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "문서를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      if (pdf) URL.revokeObjectURL(pdf);
      if (img) URL.revokeObjectURL(img);
    };
  }, [buffer, fileType, fileName]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 bg-[#c8c8c8]">
        <Loader2 className="w-8 h-8 text-lawbox-navy animate-spin" />
        <p className="text-sm text-gray-600">문서 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 px-6 bg-[#c8c8c8]">
        <p className="text-red-600 font-medium">문서를 열 수 없습니다</p>
        <p className="text-sm text-gray-600 text-center max-w-md">{error}</p>
        <p className="text-xs text-gray-400 mt-2">
          암호화된 HWP/HWPX 파일은 지원하지 않습니다.
        </p>
      </div>
    );
  }

  if ((resolvedType === "hwp" || resolvedType === "hwpx") && html) {
    return (
      <HangulViewer
        html={html}
        fileName={fileName}
        formatLabel={resolvedType === "hwp" ? "HWP 문서" : "HWPX 문서"}
      />
    );
  }
  if ((resolvedType === "docx" || resolvedType === "doc") && html) {
    return <DocxViewer html={html} />;
  }
  if ((resolvedType === "xlsx" || resolvedType === "xls" || resolvedType === "csv") && xlsx) {
    return <XlsxViewer content={xlsx} />;
  }
  if (resolvedType === "pdf" && pdfUrl) return <PdfViewer url={pdfUrl} />;
  if ((resolvedType === "txt" || resolvedType === "rtf") && text !== null) {
    return <TxtViewer text={text} />;
  }
  if (resolvedType === "markdown" && html) {
    return <MarkdownViewer html={html} fileName={fileName} />;
  }
  if (resolvedType === "html" && html) {
    return <HtmlViewer html={html} fileName={fileName} />;
  }
  if ((resolvedType === "json" || resolvedType === "xml") && code) {
    return <CodeViewer code={code} fileName={fileName} language={codeLanguage} />;
  }
  if (resolvedType === "image" && imageUrl) {
    return <ImageViewer url={imageUrl} fileName={fileName} mimeType={imageMime} />;
  }

  return (
    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
      표시할 내용이 없습니다.
    </div>
  );
}
