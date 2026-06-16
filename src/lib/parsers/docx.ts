import mammoth from "mammoth";

export async function parseDocxToHtml(buffer: ArrayBuffer): Promise<string> {
  const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
  return result.value || "<p>내용이 없습니다.</p>";
}

export async function parseDocxFromFile(file: File): Promise<string> {
  return parseDocxToHtml(await file.arrayBuffer());
}

export async function docxToPlainText(buffer: ArrayBuffer): Promise<string> {
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
}
