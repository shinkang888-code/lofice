/** Office-PowerPoint-MCP-Server API */
export function getPptMcpUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_PPT_MCP_URL?.trim();
  if (!url) return null;
  return url.replace(/\/+$/, "");
}

export function isPptMcpServerAvailable(): boolean {
  return Boolean(getPptMcpUrl());
}
