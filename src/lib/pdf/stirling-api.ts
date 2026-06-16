/**
 * Stirling-PDF REST API 클라이언트 (선택)
 * NEXT_PUBLIC_STIRLING_PDF_URL 설정 시 서버 처리, 실패 시 pdf-lib 폴백
 */
import { getStirlingPdfUrl } from "./stirling-config";
import type { StirlingToolResult } from "./stirling-tools";
import { mergePdfs, rotatePdf, splitPdfByPages } from "./stirling-tools";

async function stirlingFetch(
  endpoint: string,
  form: FormData,
): Promise<Response> {
  const base = getStirlingPdfUrl();
  if (!base) throw new Error("Stirling-PDF URL이 설정되지 않았습니다.");
  const res = await fetch(`${base}/api/v1/general${endpoint}`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Stirling API 오류 (${res.status})`);
  }
  return res;
}

function fileFromBytes(bytes: ArrayBuffer | Uint8Array, name: string): File {
  const ab = (bytes instanceof ArrayBuffer
    ? bytes
    : bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)) as ArrayBuffer;
  return new File([ab], name, { type: "application/pdf" });
}

export async function stirlingRotatePdf(
  bytes: ArrayBuffer | Uint8Array,
  angle: 90 | 180 | 270,
  fileName: string,
): Promise<StirlingToolResult> {
  if (!getStirlingPdfUrl()) return rotatePdf(bytes, angle, fileName);

  try {
    const form = new FormData();
    form.append("fileInput", fileFromBytes(bytes, fileName));
    form.append("angle", String(angle));
    const res = await stirlingFetch("/rotate-pdf", form);
    const blob = await res.blob();
    const outBytes = new Uint8Array(await blob.arrayBuffer());
    const base = fileName.replace(/\.pdf$/i, "");
    return { kind: "pdf", bytes: outBytes, fileName: `${base}_rotated.pdf` };
  } catch {
    return rotatePdf(bytes, angle, fileName);
  }
}

export async function stirlingMergePdfs(
  files: { bytes: ArrayBuffer | Uint8Array; name: string }[],
  outputName = "merged.pdf",
): Promise<StirlingToolResult> {
  if (!getStirlingPdfUrl()) return mergePdfs(files, outputName);

  try {
    const form = new FormData();
    for (const f of files) {
      form.append("fileInput", fileFromBytes(f.bytes, f.name));
    }
    const res = await stirlingFetch("/merge-pdfs", form);
    const blob = await res.blob();
    const outBytes = new Uint8Array(await blob.arrayBuffer());
    return { kind: "pdf", bytes: outBytes, fileName: outputName };
  } catch {
    return mergePdfs(files, outputName);
  }
}

export async function stirlingSplitPages(
  bytes: ArrayBuffer | Uint8Array,
  pageSpec: string,
  fileName: string,
): Promise<StirlingToolResult> {
  if (!getStirlingPdfUrl()) return splitPdfByPages(bytes, pageSpec, fileName);

  try {
    const form = new FormData();
    form.append("fileInput", fileFromBytes(bytes, fileName));
    form.append("pageNumbers", pageSpec);
    const res = await stirlingFetch("/split-pages", form);
    const blob = await res.blob();
    const outBytes = new Uint8Array(await blob.arrayBuffer());
    const base = fileName.replace(/\.pdf$/i, "");
    const contentType = res.headers.get("content-type") ?? "";

    if (contentType.includes("zip")) {
      return { kind: "pdf", bytes: outBytes, fileName: `${base}_split.zip` };
    }
    return { kind: "pdf", bytes: outBytes, fileName: `${base}_split.pdf` };
  } catch {
    return splitPdfByPages(bytes, pageSpec, fileName);
  }
}
