"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import type { DocumentType, XlsxContent, PresentationContent } from "@/types/document";
import { parseDocument } from "@/lib/parsers/document-router";
import { resolveDocumentType } from "@/lib/document-types";
import HangulViewer from "./HangulViewer";
import DocxViewer from "./DocxViewer";
import XlsxViewer from "./XlsxViewer";
import PdfViewer from "./PdfViewer";
import TxtViewer from "./TxtViewer";
import ImageViewer from "./ImageViewer";
import MarkdownViewer from "./MarkdownViewer";
import HtmlViewer from "./HtmlViewer";
import CodeViewer from "./CodeViewer";
import PresentationViewer from "./PresentationViewer";
import UnsupportedViewer from "./UnsupportedViewer";
import { Loader2 } from "lucide-react";

interface Props {
  buffer: ArrayBuffer;
  fileName: string;
  fileType: DocumentType;
}

function toArrayBuffer(data: ArrayBuffer | ArrayBufferView): ArrayBuffer {
  if (data instanceof ArrayBuffer) return data;
  const view = data as ArrayBufferView;
  return view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength) as ArrayBuffer;
}

export default function DocumentViewer({ buffer: rawBuffer, fileName, fileType }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [xlsx, setXlsx] = useState<XlsxContent | null>(null);
  const [presentation, setPresentation] = useState<PresentationContent | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string | undefined>();
  const [code, setCode] = useState<string | null>(null);
  const [codeLanguage, setCodeLanguage] = useState<"json" | "xml" | "text">("text");
  const [resolvedType, setResolvedType] = useState<DocumentType>(fileType);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [unsupported, setUnsupported] = useState(false);
  const objectUrlsRef = useRef<string[]>([]);

  const buffer = useMemo(() => toArrayBuffer(rawBuffer), [rawBuffer]);
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setPdfBuffer(null);
      setHtml(null);
      setText(null);
      setXlsx(null);
      setPresentation(null);
      setImageUrl(null);
      setCode(null);
      setUnsupported(false);

      const type = resolveDocumentType(fileName, buffer);
      if (type === "unknown") {
        setError(`지원하지 않는 형식입니다: ${fileName}`);
        setLoading(false);
        return;
      }

      try {
        if (type === "pdf") {
          if (!cancelled) {
            setResolvedType("pdf");
            setPdfBuffer(buffer);
            setLoading(false);
          }
          return;
        }

        const result = await parseDocument(buffer, fileName, type);
        if (cancelled) return;

        setResolvedType(result.type);

        if (result.unsupported) {
          setUnsupported(true);
          return;
        }

        setHtml(result.html ?? null);
        setText(result.text ?? null);
        setXlsx(result.xlsx ?? null);
        setPresentation(result.presentation ?? null);

        if (result.imageUrl) {
          objectUrlsRef.current.push(result.imageUrl);
          setImageUrl(result.imageUrl);
          setImageMime(result.imageMime);
        }
        if (result.code) {
          setCode(result.code);
          setCodeLanguage(result.codeLanguage ?? "text");
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "문서를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [buffer, fileName, fileType]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 bg-[#c8c8c8]">
        <Loader2 className="w-8 h-8 text-lofice-navy animate-spin" />
        <p className="text-sm text-gray-600">문서 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 px-6 bg-[#c8c8c8]">
        <p className="text-red-600 font-medium">문서를 열 수 없습니다</p>
        <p className="text-sm text-gray-600 text-center max-w-md">{error}</p>
        <p className="text-xs text-gray-400 mt-2">암호화된 파일은 지원하지 않을 수 있습니다.</p>
      </div>
    );
  }

  if (unsupported || resolvedType === "unsupported") {
    return <UnsupportedViewer fileName={fileName} ext={ext} />;
  }

  if (resolvedType === "pdf" && pdfBuffer) {
    return <PdfViewer buffer={pdfBuffer} fileName={fileName} />;
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

  if ((resolvedType === "docx" || resolvedType === "doc" || resolvedType === "odt" || resolvedType === "rtf" || resolvedType === "mhtml") && html) {
    return <DocxViewer html={html} />;
  }

  if ((resolvedType === "xlsx" || resolvedType === "xls" || resolvedType === "ods" || resolvedType === "csv") && xlsx) {
    return <XlsxViewer content={xlsx} />;
  }

  if (resolvedType === "presentation" && presentation) {
    return <PresentationViewer slides={presentation.slides} fileName={fileName} />;
  }

  if (resolvedType === "txt" && text !== null) {
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
    <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-500 text-sm px-4">
      <p>표시할 내용이 없습니다.</p>
      <p className="text-xs text-gray-400">{fileName} ({resolvedType})</p>
    </div>
  );
}
