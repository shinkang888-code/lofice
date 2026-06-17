/** 프로덕션 기본 hwpx-skill API (Vercel 별도 프로젝트) */
const DEFAULT_HWPX_SKILL_URL =
  process.env.NEXT_PUBLIC_HWPX_SKILL_DEFAULT_URL?.trim() ||
  "https://lofice-hwpx-skill-api.vercel.app";

/** hwpx-skill API 서버 베이스 URL */
export function getHwpxSkillUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_HWPX_SKILL_URL?.trim() || DEFAULT_HWPX_SKILL_URL;
  if (!url) return null;
  return url.replace(/\/+$/, "");
}

export function isHwpxSkillServerAvailable(): boolean {
  return Boolean(getHwpxSkillUrl());
}
