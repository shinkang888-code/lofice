import type { DocumentType } from "@/types/document";

export interface HancomParseResult {
  html: string;
  text: string;
  format: "hwp" | "hwpx";
}

function toBytes(buffer: ArrayBuffer): Uint8Array {
  return new Uint8Array(buffer);
}

export async function parseHancomDocument(buffer: ArrayBuffer): Promise<HancomParseResult> {
  const {
    detectFormat,
    hwpToText,
    hwpToHwpx,
    HwpxReader,
  } = await import("@ssabrojs/hwpxjs");

  const bytes = toBytes(buffer);
  const detected = detectFormat(bytes);

  const extractHtmlFromHwpxBuffer = async (ab: ArrayBuffer) => {
    const reader = new HwpxReader();
    await reader.loadFromArrayBuffer(ab);
    const html = await reader.extractHtml({
      renderStyles: true,
      renderTables: true,
      renderImages: true,
      embedImages: true,
      tableClassName: "hancom-table",
    });
    const text = await reader.extractText();
    return { html, text };
  };

  if (detected === "hwpx") {
    const { html, text } = await extractHtmlFromHwpxBuffer(buffer);
    return { html, text, format: "hwpx" };
  }

  if (detected === "hwp") {
    const text = await hwpToText(bytes);
    try {
      const hwpxBytes = await hwpToHwpx(bytes);
      const ab = hwpxBytes.buffer.slice(
        hwpxBytes.byteOffset,
        hwpxBytes.byteOffset + hwpxBytes.byteLength
      ) as ArrayBuffer;
      const { html } = await extractHtmlFromHwpxBuffer(ab);
      return { html, text, format: "hwp" };
    } catch {
      const html = `<div class="hancom-plain">${text
        .split("\n")
        .map((line) => `<p>${escapeHtml(line) || "&nbsp;"}</p>`)
        .join("")}</div>`;
      return { html, text, format: "hwp" };
    }
  }

  throw new Error(
    "한글 문서(.hwp/.hwpx) 형식이 아닙니다. 암호화된 문서는 아직 지원하지 않습니다."
  );
}

export async function saveHancomAsHwpx(html: string, title = "문서"): Promise<ArrayBuffer> {
  const { htmlToHwpx } = await import("@ssabrojs/hwpxjs");
  const bytes = await htmlToHwpx(html, { title, creator: "lofice" });
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

export async function saveHancomAsHwpxFromText(text: string, title = "문서"): Promise<ArrayBuffer> {
  const { HwpxWriter } = await import("@ssabrojs/hwpxjs");
  const writer = new HwpxWriter();
  const bytes = await writer.createFromPlainText(text, { title, creator: "lofice" });
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export { isHancomType, isEditableType } from "@/lib/document-types";
