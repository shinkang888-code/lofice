/**
 * ddddocr FastAPI 클라이언트
 * @see https://github.com/shinkang888-code/ddddocr — `python -m ddddocr api` / Docker
 */
import { getDdddOcrUrl } from "./ddddocr-config";

export type DdddOcrOcrOptions = {
  probability?: boolean;
  pngFix?: boolean;
  beta?: boolean;
};

export type DdddOcrDetectionResult = {
  bboxes: number[][];
  processingTime?: number;
};

export type DdddOcrSlideResult = {
  target: number[];
  targetX?: number;
  targetY?: number;
  processingTime?: number;
};

let healthCache: { ok: boolean; at: number } | null = null;
const HEALTH_TTL_MS = 30_000;

function requireBase(): string {
  const base = getDdddOcrUrl();
  if (!base) throw new Error("ddddocr 서버 URL이 설정되지 않았습니다. NEXT_PUBLIC_DDDDOCR_URL을 확인하세요.");
  return base;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function ddddocrFetch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${requireBase()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const raw = await res.text();
  let json: unknown;
  try {
    json = raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error(raw || `ddddocr API 오류 (${res.status})`);
  }

  if (!res.ok) {
    const detail =
      typeof json === "object" && json !== null && "detail" in json
        ? String((json as { detail: unknown }).detail)
        : raw;
    throw new Error(detail || `ddddocr API 오류 (${res.status})`);
  }

  return json as T;
}

/** app.py / routes.py 양쪽 응답 형식 파싱 */
function parseOcrText(payload: unknown): string {
  if (typeof payload === "string") return payload.trim();

  if (typeof payload === "object" && payload !== null) {
    const obj = payload as Record<string, unknown>;

    if (typeof obj.result === "string") return obj.result.trim();
    if (typeof obj.text === "string") return obj.text.trim();

    if (obj.success === true && obj.data && typeof obj.data === "object") {
      const data = obj.data as Record<string, unknown>;
      if (typeof data.text === "string") return data.text.trim();
      if (typeof data.result === "string") return data.result.trim();
    }

    if (obj.result && typeof obj.result === "object") {
      return JSON.stringify(obj.result, null, 2);
    }
  }

  return "";
}

function parseDetection(payload: unknown): DdddOcrDetectionResult {
  if (typeof payload === "object" && payload !== null) {
    const obj = payload as Record<string, unknown>;

    if (Array.isArray(obj.result)) {
      return {
        bboxes: obj.result as number[][],
        processingTime: typeof obj.processing_time === "number" ? obj.processing_time : undefined,
      };
    }

    if (obj.success === true && obj.data && typeof obj.data === "object") {
      const data = obj.data as { bboxes?: number[][] };
      if (Array.isArray(data.bboxes)) {
        return { bboxes: data.bboxes };
      }
    }

    if (Array.isArray(obj.bboxes)) {
      return { bboxes: obj.bboxes as number[][] };
    }
  }

  throw new Error("ddddocr 목표 검출 결과를 해석하지 못했습니다.");
}

function parseSlide(payload: unknown): DdddOcrSlideResult {
  if (typeof payload === "object" && payload !== null) {
    const obj = payload as Record<string, unknown>;
    const result = (obj.result ?? obj.data ?? obj) as Record<string, unknown>;

    if (result && typeof result === "object") {
      const target = Array.isArray(result.target) ? (result.target as number[]) : [];
      return {
        target,
        targetX: typeof result.target_x === "number" ? result.target_x : undefined,
        targetY: typeof result.target_y === "number" ? result.target_y : undefined,
        processingTime:
          typeof obj.processing_time === "number"
            ? obj.processing_time
            : typeof result.processing_time === "number"
              ? result.processing_time
              : undefined,
      };
    }
  }

  throw new Error("ddddocr 슬라이드 결과를 해석하지 못했습니다.");
}

export async function checkDdddOcrHealth(force = false): Promise<boolean> {
  const base = getDdddOcrUrl();
  if (!base) return false;

  if (!force && healthCache && Date.now() - healthCache.at < HEALTH_TTL_MS) {
    return healthCache.ok;
  }

  try {
    const res = await fetch(`${base}/health`, { method: "GET" });
    if (!res.ok) {
      healthCache = { ok: false, at: Date.now() };
      return false;
    }
    const json = (await res.json()) as { status?: string };
    const ok = json.status === "ok" || json.status === "healthy";
    healthCache = { ok, at: Date.now() };
    return ok;
  } catch {
    healthCache = { ok: false, at: Date.now() };
    return false;
  }
}

export async function ddddocrClassifyBuffer(
  buffer: ArrayBuffer,
  options: DdddOcrOcrOptions = {},
): Promise<string> {
  const image = arrayBufferToBase64(buffer);
  const beta = options.beta ?? false;

  try {
    const modern = await ddddocrFetch<unknown>("/ocr", {
      image,
      probability: options.probability ?? false,
      png_fix: options.pngFix ?? false,
    });
    const text = parseOcrText(modern);
    if (text) return text;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (!msg.includes("OCR功能未初始化") && !msg.includes("404")) throw e;
  }

  await ddddocrInitialize({ ocr: true, beta });

  const legacy = await ddddocrFetch<{ success?: boolean; data?: { text?: string } }>("/ocr", {
    image,
    probability: options.probability ?? false,
    png_fix: options.pngFix ?? false,
  });

  const text = parseOcrText(legacy);
  if (!text) throw new Error("ddddocr OCR 결과가 비어 있습니다.");
  return text;
}

export async function ddddocrClassifyBlob(blob: Blob, options?: DdddOcrOcrOptions): Promise<string> {
  return ddddocrClassifyBuffer(await blob.arrayBuffer(), options);
}

export async function ddddocrDetectBuffer(buffer: ArrayBuffer): Promise<DdddOcrDetectionResult> {
  const image = arrayBufferToBase64(buffer);

  try {
    const res = await ddddocrFetch<unknown>("/det", { image });
    return parseDetection(res);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (!msg.includes("未初始化")) throw e;
  }

  await ddddocrInitialize({ ocr: false, det: true });
  const legacy = await ddddocrFetch<unknown>("/detect", { image });
  return parseDetection(legacy);
}

export async function ddddocrSlideMatch(
  targetBuffer: ArrayBuffer,
  backgroundBuffer: ArrayBuffer,
  simpleTarget = false,
): Promise<DdddOcrSlideResult> {
  const body = {
    target_image: arrayBufferToBase64(targetBuffer),
    background_image: arrayBufferToBase64(backgroundBuffer),
    simple_target: simpleTarget,
  };

  try {
    const res = await ddddocrFetch<unknown>("/slide_match", body);
    return parseSlide(res);
  } catch {
    const res = await ddddocrFetch<unknown>("/slide-match", body);
    return parseSlide(res);
  }
}

export async function ddddocrSlideComparison(
  targetBuffer: ArrayBuffer,
  backgroundBuffer: ArrayBuffer,
): Promise<DdddOcrSlideResult> {
  const body = {
    target_image: arrayBufferToBase64(targetBuffer),
    background_image: arrayBufferToBase64(backgroundBuffer),
  };

  try {
    const res = await ddddocrFetch<unknown>("/slide_comparison", body);
    return parseSlide(res);
  } catch {
    const res = await ddddocrFetch<unknown>("/slide-comparison", body);
    return parseSlide(res);
  }
}

async function ddddocrInitialize(config: { ocr?: boolean; det?: boolean; beta?: boolean }): Promise<void> {
  await ddddocrFetch("/initialize", {
    ocr: config.ocr ?? true,
    det: config.det ?? false,
    beta: config.beta ?? false,
    old: false,
    use_gpu: false,
    device_id: 0,
    import_onnx_path: "",
    charsets_path: "",
  });
}
