/**
 * PptxGenJS 브라우저 스크립트 로더 (static export 호환)
 * @see https://github.com/shinkang888-code/PptxGenJS
 */
export type LoficePptxGen = import("pptxgenjs").default;

const SCRIPT_SRC = "/vendor/pptxgen.bundle.js";

declare global {
  interface Window {
    PptxGenJS?: new () => LoficePptxGen;
  }
}

function loadScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("PptxGenJS는 브라우저에서만 사용할 수 있습니다."));
  }
  if (window.PptxGenJS) return Promise.resolve();

  const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      if (window.PptxGenJS) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("PptxGenJS script load failed")));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("PptxGenJS script load failed"));
    document.head.appendChild(script);
  });
}

export async function loadPptxGenJSConstructor(): Promise<new () => LoficePptxGen> {
  await loadScript();
  if (!window.PptxGenJS) throw new Error("PptxGenJS global not found");
  return window.PptxGenJS;
}

export async function createPresentation(): Promise<LoficePptxGen> {
  const PptxGen = await loadPptxGenJSConstructor();
  const pres = new PptxGen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "lofice";
  pres.company = "lofice";
  return pres;
}

export async function writePresentationArrayBuffer(pres: LoficePptxGen): Promise<ArrayBuffer> {
  const out = await pres.write({ outputType: "arraybuffer" });
  if (out instanceof ArrayBuffer) return out;
  if (out instanceof Uint8Array) {
    return out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength) as ArrayBuffer;
  }
  throw new Error("PptxGenJS write did not return ArrayBuffer");
}
