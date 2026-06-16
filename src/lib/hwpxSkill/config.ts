/** hwpx-skill API 서버 베이스 URL */
export function getHwpxSkillUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_HWPX_SKILL_URL?.trim();
  if (!url) return null;
  return url.replace(/\/+$/, "");
}

export function isHwpxSkillServerAvailable(): boolean {
  return Boolean(getHwpxSkillUrl());
}
