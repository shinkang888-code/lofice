/** IndexedDB·pdfjs·Worker 전달 후 detached 방지용 복제 */
export function cloneArrayBuffer(buffer: ArrayBuffer): ArrayBuffer {
  return buffer.slice(0);
}
