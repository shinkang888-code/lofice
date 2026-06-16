"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import type { DocumentType, XlsxContent, PresentationContent } from "@/types/document";
import { parseDocument } from "@/lib/parsers/document-router";
import { resolveDocumentType } from "@/lib/document-types";
import dynamic from "next/dynamic";
import HangulViewer from "./HangulViewer";
import DocxViewer from "./DocxViewer";
import XlsxViewer from "./XlsxViewer";
import PdfViewer from "./PdfViewer";
import TxtViewer from "./TxtViewer";
import ImageViewer from "./ImageViewer";
import MarkdownViewer from "./MarkdownViewer";
import HtmlViewer from "./HtmlViewer";
import CodeViewer from "./CodeViewer";
import UnsupportedViewer from "./UnsupportedViewer";
import { Loader2 } from "lucide-react";
import { isOfficeCryptoFileName, isOfficeEncrypted } from "@/lib/msoffice/office-crypto";
import OfficeDecryptGate from "../msoffice/OfficeDecryptGate";

const UDocViewerWrapper = dynamic(() => import("./UDocViewerWrapper"), { ssr: false });
const RhwpCanvasViewer = dynamic(() => import("../hwp/RhwpCanvasViewer"), { ssr: false });
const RhwpViewer = dynamic(() => import("./RhwpViewer"), { ssr: false });
const PptMasterViewer = dynamic(() => import("../ppt/PptMasterViewer"), { ssr: false });
const MicroscopePptxViewer = dynamic(() => import("../ppt/MicroscopePptxViewer"), { ssr: false });
const MicroscopeOfficeViewer = dynamic(() => import("./MicroscopeOfficeViewer"), { ssr: false });
const ArchivePanel = dynamic(() => import("../archive/ArchivePanel"), { ssr: false });

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
  const [officeBuffer, setOfficeBuffer] = useState<ArrayBuffer | null>(null);
  const [udocPdfFallback, setUdocPdfFallback] = useState(false);
  const [udocDocxFallback, setUdocDocxFallback] = useState(false);
  const [rhwpFallback, setRhwpFallback] = useState(false);
  const [microscopeFallback, setMicroscopeFallback] = useState(false);
  const [pptFallback, setPptFallback] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [workBuffer, setWorkBuffer] = useState<ArrayBuffer | null>(null);
  const [cryptoCheckDone, setCryptoCheckDone] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const objectUrlsRef = useRef<string[]>([]);

  const buffer = useMemo(() => toArrayBuffer(rawBuffer), [rawBuffer]);
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";

  useEffect(() => {
    let cancelled = false;
    setCryptoCheckDone(false);
    setWorkBuffer(null);
    setNeedsPassword(false);

    async function checkEncryption() {
      if (!isOfficeCryptoFileName(fileName)) {
        if (!cancelled) {
          setWorkBuffer(buffer);
          setCryptoCheckDone(true);
        }
        return;
      }
      try {
        const encrypted = await isOfficeEncrypted(buffer);
        if (cancelled) return;
        if (encrypted) setNeedsPassword(true);
        else setWorkBuffer(buffer);
      } catch {
        if (!cancelled) setWorkBuffer(buffer);
      } finally {
        if (!cancelled) setCryptoCheckDone(true);
      }
    }

    void checkEncryption();
    return () => { cancelled = true; };
  }, [buffer, fileName]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!workBuffer) return;
    const docBuffer = workBuffer;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setPdfBuffer(null);
      setOfficeBuffer(null);
      setUdocPdfFallback(false);
      setUdocDocxFallback(false);
      setRhwpFallback(false);
      setMicroscopeFallback(false);
      setPptFallback(false);
      setHtml(null);
      setText(null);
      setXlsx(null);
      setPresentation(null);
      setImageUrl(null);
      setCode(null);
      setUnsupported(false);

      const type = resolveDocumentType(fileName, docBuffer);
      if (type === "unknown") {
        setError(`지원하지 않는 형식입니다: ${fileName}`);
        setLoading(false);
        return;
      }

      try {
        if (type === "pdf") {
          if (!cancelled) {
            setResolvedType("pdf");
            setPdfBuffer(docBuffer);
            setLoading(false);
          }
          return;
        }

        if (type === "archive") {
          if (!cancelled) {
            setResolvedType("archive");
            setOfficeBuffer(docBuffer);
            setLoading(false);
          }
          return;
        }

        if (type === "hwp" || type === "hwpx") {
          if (!cancelled) {
            setResolvedType(type);
            setOfficeBuffer(docBuffer);
            try {
              const result = await parseDocument(docBuffer, fileName, type);
              if (!cancelled) setHtml(result.html ?? null);
            } catch { /* rhwp primary, html fallback optional */ }
            setLoading(false);
          }
          return;
        }

        if (type === "docx" || type === "doc" || type === "odt") {
          if (!cancelled) {
            setResolvedType(type);
            setOfficeBuffer(docBuffer);
            if (type === "docx" || type === "doc") {
              parseDocument(docBuffer, fileName, type)
                .then((r) => { if (!cancelled) setHtml(r.html ?? null); })
                .catch(() => {});
            } else {
              const result = await parseDocument(docBuffer, fileName, type);
              if (!cancelled) setHtml(result.html ?? null);
            }
            setLoading(false);
          }
          return;
        }

        if (type === "xlsx" || type === "xls" || type === "ods" || type === "csv") {
          if (!cancelled) {
            setResolvedType(type);
            setOfficeBuffer(docBuffer);
            const result = await parseDocument(docBuffer, fileName, type);
            if (!cancelled) setXlsx(result.xlsx ?? null);
            setLoading(false);
          }
          return;
        }

        const result = await parseDocument(docBuffer, fileName, type);
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
  }, [workBuffer, fileName, fileType]);

  if (!cryptoCheckDone) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 bg-[#c8c8c8]">
        <Loader2 className="w-8 h-8 text-lofice-navy animate-spin" />
        <p className="text-sm text-gray-600">문서 확인 중...</p>
      </div>
    );
  }

  if (needsPassword) {
    return (
      <OfficeDecryptGate
        buffer={buffer}
        fileName={fileName}
        onDecrypted={(decrypted) => {
          setNeedsPassword(false);
          setWorkBuffer(decrypted);
        }}
      />
    );
  }

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
    if (!udocPdfFallback) {
      return (
        <UDocViewerWrapper
          buffer={pdfBuffer}
          fileName={fileName}
          docType="pdf"
          onFallback={() => setUdocPdfFallback(true)}
        />
      );
    }
    return <PdfViewer buffer={pdfBuffer} fileName={fileName} />;
  }

  if (resolvedType === "archive" && officeBuffer) {
    return <ArchivePanel buffer={officeBuffer} fileName={fileName} className="h-full" />;
  }

  if ((resolvedType === "hwp" || resolvedType === "hwpx") && officeBuffer) {
    if (!rhwpFallback) {
      return (
        <RhwpCanvasViewer
          buffer={officeBuffer}
          fileName={fileName}
          onFallback={() => setRhwpFallback(true)}
        />
      );
    }
    if (html) {
      return (
        <HangulViewer
          html={html}
          fileName={fileName}
          formatLabel={resolvedType === "hwp" ? "HWP 문서" : "HWPX 문서"}
        />
      );
    }
  }

  if ((resolvedType === "docx" || resolvedType === "doc") && officeBuffer && !udocDocxFallback) {
    return (
      <div className="h-full relative">
        <UDocViewerWrapper
          buffer={officeBuffer}
          fileName={fileName}
          docType="docx"
          onFallback={() => setUdocDocxFallback(true)}
        />
      </div>
    );
  }

  if ((resolvedType === "docx" || resolvedType === "doc") && officeBuffer && !microscopeFallback) {
    return (
      <div className="h-full relative">
        <MicroscopeOfficeViewer buffer={officeBuffer} fileName={fileName} />
        {html && (
          <button
            type="button"
            onClick={() => setMicroscopeFallback(true)}
            className="absolute bottom-3 right-3 text-[10px] bg-white/90 border px-2 py-1 rounded shadow"
          >
            기본 HTML 뷰어
          </button>
        )}
      </div>
    );
  }

  if ((resolvedType === "docx" || resolvedType === "doc" || resolvedType === "odt" || resolvedType === "rtf" || resolvedType === "mhtml") && html) {
    return <DocxViewer html={html} />;
  }

  if ((resolvedType === "xlsx" || resolvedType === "xls" || resolvedType === "ods" || resolvedType === "csv") && xlsx) {
    return <XlsxViewer content={xlsx} />;
  }

  if ((resolvedType === "xlsx" || resolvedType === "xls" || resolvedType === "ods") && officeBuffer && !xlsx) {
    return <MicroscopeOfficeViewer buffer={officeBuffer} fileName={fileName} />;
  }

  if (resolvedType === "presentation" && presentation) {
    if (pptFallback) {
      return <MicroscopePptxViewer buffer={workBuffer ?? buffer} fileName={fileName} />;
    }
    return (
      <PptMasterViewer
        slides={presentation.slides}
        fileName={fileName}
        buffer={workBuffer ?? buffer}
      />
    );
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
