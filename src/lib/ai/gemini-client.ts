/** Google Gemini API 클라이언트 (브라우저) */

export type GeminiMessage = { role: "user" | "model"; text: string };

function getApiKey(): string | null {
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim() || null;
}

export function isGeminiConfigured(): boolean {
  return Boolean(getApiKey());
}

export async function chatWithGemini(
  messages: GeminiMessage[],
  systemPrompt?: string,
): Promise<string> {
  const key = getApiKey();
  if (!key) {
    throw new Error("Gemini API 키가 설정되지 않았습니다. NEXT_PUBLIC_GEMINI_API_KEY를 확인하세요.");
  }

  const model = process.env.NEXT_PUBLIC_GEMINI_MODEL?.trim() || "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  const contents = messages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));

  const body: Record<string, unknown> = { contents };
  if (systemPrompt) {
    body.systemInstruction = { parts: [{ text: systemPrompt }] };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err.slice(0, 300) || `Gemini API 오류 (${res.status})`);
  }

  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini 응답이 비어 있습니다.");
  return text;
}
