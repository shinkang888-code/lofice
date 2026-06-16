export function parseMarkdownToHtml(md: string): string {
  let html = md
    .replace(/^### (.*)$/gim, "<h3>$1</h3>")
    .replace(/^## (.*)$/gim, "<h2>$1</h2>")
    .replace(/^# (.*)$/gim, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/gim, "<em>$1</em>")
    .replace(/`([^`]+)`/gim, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-lawbox-navy underline">$1</a>');

  const lines = html.split("\n");
  const out: string[] = [];
  let inList = false;

  for (const line of lines) {
    if (/^\- /.test(line)) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${line.slice(2)}</li>`);
    } else {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      if (line.trim() === "") {
        out.push("");
      } else if (/^<h[1-3]>/.test(line)) {
        out.push(line);
      } else {
        out.push(`<p>${line}</p>`);
      }
    }
  }
  if (inList) out.push("</ul>");

  return out.join("\n");
}
