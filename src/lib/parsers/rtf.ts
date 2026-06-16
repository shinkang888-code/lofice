/** RTF → HTML (RTFHTML.DLL 역할의 경량 구현) */
export function parseRtfToHtml(rtf: string): string {
  let text = rtf;

  text = text.replace(/\\par[d]?/g, "\n");
  text = text.replace(/\\line/g, "\n");
  text = text.replace(/\\tab/g, "\t");
  text = text.replace(/\\'[0-9a-f]{2}/gi, (m) => {
    const code = parseInt(m.slice(2), 16);
    return String.fromCharCode(code);
  });

  text = text.replace(/\\[a-z]+\d* ?/gi, "");
  text = text.replace(/[{}]/g, "");

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return "<p>내용이 없습니다.</p>";

  return lines.map((l) => `<p class="mb-2">${escapeHtml(l)}</p>`).join("");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function parseRtfFromBuffer(buffer: ArrayBuffer): string {
  const rtf = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
  if (!rtf.trimStart().startsWith("{\\rtf")) {
    return `<pre class="whitespace-pre-wrap">${escapeHtml(rtf)}</pre>`;
  }
  return parseRtfToHtml(rtf);
}
