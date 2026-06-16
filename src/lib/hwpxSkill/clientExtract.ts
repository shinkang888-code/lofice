/** 클라이언트 HWP/HWPX 텍스트 추출 — hwpx-skill 서버 없을 때 폴백 */
import { parseHancomDocument } from "@/lib/parsers/hancom";

export async function extractHancomTextClient(buffer: ArrayBuffer): Promise<string> {
  const { text } = await parseHancomDocument(buffer);
  return text.trim();
}

export async function extractHancomMarkdownClient(buffer: ArrayBuffer): Promise<string> {
  const { text, format } = await parseHancomDocument(buffer);
  const lines = text.split("\n").filter((l) => l.trim());
  const heading = format === "hwpx" ? "# HWPX 문서\n\n" : "# HWP 문서\n\n";
  return heading + lines.join("\n\n");
}
