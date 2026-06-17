import type { DocumentType, PresentationContent } from "@/types/document";
import { parseHancomDocument } from "@/lib/parsers/hancom";
import type { HwpPackageInfo } from "@/lib/hwp/extract-hwp-package";
import { parseDocxToHtml } from "@/lib/parsers/docx";
import { parseXlsx } from "@/lib/parsers/xlsx";
import { parseMarkdownToHtml } from "@/lib/parsers/markdown";
import { parsePresentation } from "@/lib/parsers/pptx";
import { parseOdtToHtml, parseOdsToSheets } from "@/lib/parsers/odf";
import { parseMhtml } from "@/lib/parsers/mhtml";
import { parseRtfFromBuffer } from "@/lib/parsers/rtf";
import { parseEmailMessage } from "@/lib/parsers/outlook";

export interface DocumentParseResult {
  type: DocumentType;
  html?: string;
  text?: string;
  xlsx?: ReturnType<typeof parseXlsx>;
  presentation?: PresentationContent;
  pdfUrl?: string;
  imageUrl?: string;
  imageMime?: string;
  code?: string;
  codeLanguage?: "json" | "xml" | "text";
  unsupported?: boolean;
  hwpPackage?: HwpPackageInfo;
}

const IMAGE_MIME: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", jfif: "image/jpeg", jpe: "image/jpeg",
  png: "image/png", gif: "image/gif", webp: "image/webp", bmp: "image/bmp",
  svg: "image/svg+xml", tif: "image/tiff", tiff: "image/tiff", dib: "image/bmp",
  emf: "image/emf", wmf: "image/wmf",
};

function getImageMime(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "png";
  return IMAGE_MIME[ext] ?? "image/png";
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function parseDocument(
  buffer: ArrayBuffer,
  fileName: string,
  fileType: DocumentType
): Promise<DocumentParseResult> {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "eml" || ext === "msg") {
    const email = parseEmailMessage(buffer, fileName);
    return { type: "html", html: email.html, text: email.subject };
  }

  switch (fileType) {
    case "unsupported":
      return { type: "unsupported", unsupported: true };

    case "hwp":
    case "hwpx": {
      const result = await parseHancomDocument(buffer);
      return {
        type: result.format,
        html: result.html,
        text: result.text,
        hwpPackage: result.packageInfo,
      };
    }

    case "docx":
    case "doc":
      return { type: fileType, html: await parseDocxToHtml(buffer) };

    case "odt":
      return { type: "odt", html: await parseOdtToHtml(buffer) };

    case "xlsx":
    case "xls":
    case "csv":
      return { type: fileType, xlsx: parseXlsx(buffer) };

    case "ods": {
      const sheets = await parseOdsToSheets(buffer);
      return { type: "ods", xlsx: { sheets } };
    }

    case "presentation": {
      const { slides } = await parsePresentation(buffer, fileName);
      return { type: "presentation", presentation: { slides } };
    }

    case "pdf": {
      const url = URL.createObjectURL(new Blob([buffer], { type: "application/pdf" }));
      return { type: "pdf", pdfUrl: url };
    }

    case "rtf":
      return { type: "rtf", html: parseRtfFromBuffer(buffer) };

    case "mhtml": {
      const { html, title } = parseMhtml(buffer);
      return { type: "mhtml", html, text: title };
    }

    case "txt": {
      const text = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
      return { type: "txt", text, html: `<pre class="whitespace-pre-wrap">${escapeHtml(text)}</pre>` };
    }

    case "markdown": {
      const text = new TextDecoder().decode(buffer);
      return { type: "markdown", text, html: parseMarkdownToHtml(text) };
    }

    case "html": {
      const html = new TextDecoder().decode(buffer);
      return { type: "html", html, text: html };
    }

    case "json": {
      const code = new TextDecoder().decode(buffer);
      return { type: "json", code, codeLanguage: "json", text: code };
    }

    case "xml": {
      const code = new TextDecoder().decode(buffer);
      return { type: "xml", code, codeLanguage: "xml", text: code };
    }

    case "image": {
      const mime = getImageMime(fileName);
      const url = URL.createObjectURL(new Blob([buffer], { type: mime }));
      return { type: "image", imageUrl: url, imageMime: mime };
    }

    default:
      throw new Error(`지원하지 않는 형식입니다: ${fileName}`);
  }
}
