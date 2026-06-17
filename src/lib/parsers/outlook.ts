/** Outlook .eml / .msg 경량 파서 (Phase 2) */

export type EmailParseResult = {
  subject: string;
  from: string;
  to: string;
  date: string;
  html: string;
  text: string;
};

function decodeBodyPart(raw: string, encoding: string): string {
  const enc = encoding.toLowerCase();
  if (enc.includes("base64")) {
    try {
      const bin = atob(raw.replace(/\s/g, ""));
      return new TextDecoder("utf-8", { fatal: false }).decode(
        Uint8Array.from(bin, (c) => c.charCodeAt(0)),
      );
    } catch {
      return raw;
    }
  }
  if (enc.includes("quoted-printable")) {
    return raw
      .replace(/=\r?\n/g, "")
      .replace(/=([0-9A-F]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  }
  return raw;
}

function headerValue(headers: string, name: string): string {
  const re = new RegExp(`^${name}:\\s*(.+)$`, "im");
  const m = headers.match(re);
  return m?.[1]?.trim() ?? "";
}

export function parseEml(buffer: ArrayBuffer): EmailParseResult {
  const raw = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
  const split = raw.match(/\r?\n\r?\n/);
  const headerBlock = split ? raw.slice(0, split.index) : raw;
  const bodyBlock = split ? raw.slice(split.index! + split[0].length) : "";

  const subject = headerValue(headerBlock, "Subject");
  const from = headerValue(headerBlock, "From");
  const to = headerValue(headerBlock, "To");
  const date = headerValue(headerBlock, "Date");

  let text = bodyBlock.trim();
  let html = "";

  const boundaryMatch = headerBlock.match(/boundary="?([^"\s;]+)"?/i);
  if (boundaryMatch) {
    const boundary = boundaryMatch[1]!;
    const parts = bodyBlock.split(`--${boundary}`);
    for (const part of parts) {
      if (!part.trim() || part.trim() === "--") continue;
      const partSplit = part.match(/\r?\n\r?\n/);
      const partHeaders = partSplit ? part.slice(0, partSplit.index) : "";
      const partBody = partSplit ? part.slice(partSplit.index! + partSplit[0].length) : part;
      const cte = headerValue(partHeaders, "Content-Transfer-Encoding");
      const ctype = headerValue(partHeaders, "Content-Type").toLowerCase();
      const decoded = decodeBodyPart(partBody.trim(), cte);
      if (ctype.includes("text/html")) html = decoded;
      else if (ctype.includes("text/plain") && !text) text = decoded;
    }
  }

  if (!html) {
    html = `<article class="email-view"><header><p><strong>제목:</strong> ${escapeHtml(subject)}</p><p><strong>보낸 사람:</strong> ${escapeHtml(from)}</p><p><strong>받는 사람:</strong> ${escapeHtml(to)}</p><p><strong>날짜:</strong> ${escapeHtml(date)}</p></header><pre class="whitespace-pre-wrap text-sm">${escapeHtml(text)}</pre></article>`;
  }

  return { subject, from, to, date, html, text };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function parseEmailMessage(buffer: ArrayBuffer, fileName: string): EmailParseResult {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "eml") return parseEml(buffer);
  const text = new TextDecoder("utf-8", { fatal: false }).decode(buffer.slice(0, 4096));
  return {
    subject: "(Outlook MSG — 미리보기 제한)",
    from: "",
    to: "",
    date: "",
    text,
    html: `<div class="p-4 text-sm text-gray-600"><p>Outlook .msg 파일은 완전 지원되지 않습니다.</p><p>첨부 파일을 개별 저장하거나 .eml로 변환해 주세요.</p><pre class="mt-2 text-xs opacity-60">${escapeHtml(text.slice(0, 500))}</pre></div>`,
  };
}
