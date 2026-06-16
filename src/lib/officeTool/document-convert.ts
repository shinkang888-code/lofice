/**
 * Office Tool Plus 문서 변환 — lofice 클라이언트 변환 엔진
 * (OTP는 Office COM; lofice는 브라우저 파서 사용)
 */
import { getDocumentType } from "@/lib/document-types";

export type ConvertInputFormat = "docx" | "xlsx" | "csv" | "hwp" | "hwpx" | "txt" | "md" | "html";
export type ConvertOutputFormat = "txt" | "html" | "csv" | "md" | "json";

export type ConvertJob = {
  id: string;
  fileName: string;
  input: ConvertInputFormat;
  output: ConvertOutputFormat;
  status: "pending" | "done" | "error";
  error?: string;
  resultBytes?: Uint8Array;
  resultName?: string;
};

export const CONVERT_MATRIX: Record<ConvertInputFormat, ConvertOutputFormat[]> = {
  docx: ["txt", "html", "md"],
  xlsx: ["csv", "txt", "json"],
  csv: ["txt", "json"],
  hwp: ["txt", "html"],
  hwpx: ["txt", "html"],
  txt: ["md", "html"],
  md: ["html", "txt"],
  html: ["txt", "md"],
};

function extOf(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

export function detectInputFormat(fileName: string): ConvertInputFormat | null {
  const ext = extOf(fileName);
  const map: Record<string, ConvertInputFormat> = {
    docx: "docx", doc: "docx", xlsx: "xlsx", xls: "xlsx", csv: "csv",
    hwp: "hwp", hwpx: "hwpx", txt: "txt", md: "md", markdown: "md", html: "html", htm: "html",
  };
  return map[ext] ?? null;
}

export function outputFileName(inputName: string, output: ConvertOutputFormat): string {
  const base = inputName.replace(/\.[^.]+$/, "");
  const extMap: Record<ConvertOutputFormat, string> = {
    txt: ".txt", html: ".html", csv: ".csv", md: ".md", json: ".json",
  };
  return `${base}${extMap[output]}`;
}

export async function convertDocument(
  buffer: ArrayBuffer,
  fileName: string,
  output: ConvertOutputFormat,
): Promise<{ bytes: Uint8Array; outName: string }> {
  const input = detectInputFormat(fileName);
  if (!input) throw new Error("지원하지 않는 입력 형식입니다.");
  if (!CONVERT_MATRIX[input].includes(output)) {
    throw new Error(`${input} → ${output} 변환은 지원하지 않습니다.`);
  }

  const outName = outputFileName(fileName, output);
  let text = "";

  if (input === "docx") {
    const mammoth = await import("mammoth");
    if (output === "html") {
      const { value } = await mammoth.convertToHtml({ arrayBuffer: buffer });
      return { bytes: new TextEncoder().encode(value), outName };
    }
    const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
    text = value;
  } else if (input === "xlsx" || input === "csv") {
    const XLSX = await import("xlsx");
    const wb = XLSX.read(buffer, { type: "array" });
    if (output === "json") {
      const sheet = wb.Sheets[wb.SheetNames[0]!];
      const json = XLSX.utils.sheet_to_json(sheet);
      return { bytes: new TextEncoder().encode(JSON.stringify(json, null, 2)), outName };
    }
    const sheet = wb.Sheets[wb.SheetNames[0]!];
    text = XLSX.utils.sheet_to_csv(sheet);
  } else if (input === "hwp" || input === "hwpx") {
    const { parseHancomDocument } = await import("@/lib/parsers/hancom");
    const parsed = await parseHancomDocument(buffer);
    if (output === "html") {
      return { bytes: new TextEncoder().encode(parsed.html), outName };
    }
    text = parsed.text;
  } else {
    text = new TextDecoder().decode(buffer);
    if (output === "html" && input === "md") {
      const { parseMarkdownToHtml } = await import("@/lib/parsers/markdown");
      return { bytes: new TextEncoder().encode(await parseMarkdownToHtml(text)), outName };
    }
    if (output === "md" && input === "txt") {
      text = `# ${fileName.replace(/\.[^.]+$/, "")}\n\n${text}`;
    }
  }

  if (output === "md" && input !== "md") {
    text = `# ${fileName.replace(/\.[^.]+$/, "")}\n\n${text}`;
  }

  return { bytes: new TextEncoder().encode(text), outName };
}

export function isConvertSupported(fileName: string): boolean {
  const type = getDocumentType(fileName);
  return ["docx", "doc", "xlsx", "xls", "csv", "hwp", "hwpx", "txt", "markdown", "html"].includes(type);
}
