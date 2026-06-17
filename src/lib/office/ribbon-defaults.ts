/** 뷰어 모드 공통 리본 동작 — 선택 텍스트 복사·인쇄·다운로드 */

export function copySelectionToClipboard(): void {
  const text = window.getSelection()?.toString()?.trim();
  if (!text) {
    alert("복사할 텍스트를 먼저 선택하세요.");
    return;
  }
  void navigator.clipboard.writeText(text);
}

export function downloadBuffer(buffer: ArrayBuffer, fileName: string, mime?: string): void {
  const blob = new Blob([buffer], { type: mime ?? "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export function printDocument(): void {
  window.print();
}
