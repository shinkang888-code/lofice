/** hwpx-skill 워크플로우 — SKILL.md Decision Tree */

export type HwpxWorkflowId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J";

export type HwpxTemplateId = "report" | "gonmun" | "minutes" | "proposal" | "government" | "base";

export type HwpxSkillHealth = {
  status: string;
  skill_ready: boolean;
  ai_enabled: boolean;
  workflows?: string[];
};

export type HwpxSkillFileResult = {
  file_name: string;
  data_base64: string;
};

export type HwpxAiChatResult = {
  reply: string;
  workflow?: string;
  file_name?: string;
  data_base64?: string;
  plan?: Record<string, unknown>;
};

export type HwpxExtractResult = {
  text: string;
  format: "plain" | "markdown";
};

export type HwpxDvcResult = {
  score: number;
  passed: boolean;
  report: Record<string, unknown>;
  issues: string[];
};

export type HwpxDecryptResult = {
  ok: boolean;
  file_name?: string;
  data_base64?: string;
  message?: string;
};

export type HwpxOwpmlPatchResult = {
  file_name: string;
  data_base64: string;
  patches_applied: number;
};

export const TEMPLATE_LABEL: Record<HwpxTemplateId, string> = {
  report: "보고서",
  gonmun: "공문",
  minutes: "회의록",
  proposal: "제안서",
  government: "관공서",
  base: "기본",
};

export const WORKFLOW_LABEL: Record<HwpxWorkflowId, string> = {
  A: "마크다운/텍스트 → HWPX",
  B: "템플릿 플레이스홀더 치환",
  C: "기존 HWPX 편집",
  D: "레퍼런스 기반 생성",
  E: "텍스트 읽기/추출",
  F: "양식 복제",
  G: "2025 공문서 작성",
  H: "HWP → HWPX 변환",
  I: "문제지+답안지",
  J: "양식 필드 채우기",
};

export const QUICK_PROMPTS: { id: string; label: string; prompt: string; template: HwpxTemplateId }[] = [
  {
    id: "report",
    label: "보고서 작성",
    template: "report",
    prompt: "다음 주제로 한글 보고서 HWPX를 작성해 주세요. 제목, 개요, 본문 3절, 결론을 포함하세요.",
  },
  {
    id: "gonmun",
    label: "공문 작성",
    template: "gonmun",
    prompt: "2025 개정 공문서 형식에 맞는 기안문 초안을 작성해 주세요. 수신, 제목, 본문, 붙임, 담당자란을 포함하세요.",
  },
  {
    id: "minutes",
    label: "회의록",
    template: "minutes",
    prompt: "팀 주간 회의록 HWPX 초안을 작성해 주세요. 일시, 참석자, 안건, 결정사항, 향후 일정을 포함하세요.",
  },
  {
    id: "convert",
    label: "HWP 변환",
    template: "base",
    prompt: "첨부한 HWP 파일을 HWPX로 변환해 주세요.",
  },
  {
    id: "extract",
    label: "텍스트 추출",
    template: "base",
    prompt: "첨부 문서의 전체 텍스트를 마크다운 형식으로 추출해 주세요.",
  },
];
