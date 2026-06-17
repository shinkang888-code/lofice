/**
 * Google Gemini API 클라이언트 (브라우저 직접 호출)
 * NEXT_PUBLIC_GEMINI_API_KEY 필요
 */

export type GeminiMessage = { role: "user" | "model"; text: string };

const MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL?.trim() || "gemini-2.0-flash";

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim());
}

export async function chatWithGemini(
  messages: GeminiMessage[],
  userPrompt: string,
): Promise<string> {
  const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim();
  if (!key) {
    return "Gemini API 키가 설정되지 않았습니다. 관리자에게 NEXT_PUBLIC_GEMINI_API_KEY 설정을 요청하세요.";
  }

  const contents = [
    ...messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    })),
    { role: "user", parts: [{ text: userPrompt }] },
  ];

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{
            text:
              "You are LOFFICE AI, a helpful document assistant for HWP, Office, and PDF workflows. " +
              "Reply in the user's language. Be concise and practical.",
          }],
        },
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err.slice(0, 200) || `Gemini 오류 ${res.status}`);
  }

  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini 응답이 비어 있습니다.");
  return text;
}
