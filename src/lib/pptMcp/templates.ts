/** Office-PowerPoint-MCP-Server slide_layout_templates (메타데이터) */
export type PptTemplateCategory =
  | "title"
  | "content"
  | "business"
  | "process"
  | "team";

export type PptSlideTemplate = {
  id: string;
  name: string;
  category: PptTemplateCategory;
  description: string;
  elements: string[];
};

export const PPT_SLIDE_TEMPLATES: PptSlideTemplate[] = [
  { id: "title_slide", name: "타이틀", category: "title", description: "제목·부제·작성자", elements: ["title", "subtitle", "author"] },
  { id: "chapter_intro", name: "챕터 소개", category: "title", description: "섹션 구분", elements: ["title", "chapter_number"] },
  { id: "thank_you_slide", name: "감사 슬라이드", category: "title", description: "마무리·연락처", elements: ["title", "contact"] },
  { id: "text_with_image", name: "텍스트+이미지", category: "content", description: "본문과 이미지", elements: ["title", "content"] },
  { id: "two_column_text", name: "2단 텍스트", category: "content", description: "좌우 2열", elements: ["title", "content_left", "content_right"] },
  { id: "three_column_layout", name: "3단 레이아웃", category: "content", description: "3열 구성", elements: ["title", "col1", "col2", "col3"] },
  { id: "full_image_slide", name: "풀 이미지", category: "content", description: "배경 이미지+오버레이", elements: ["title", "caption"] },
  { id: "key_metrics_dashboard", name: "핵심 지표", category: "business", description: "KPI 대시보드", elements: ["title", "metric_1_value", "metric_2_value", "metric_3_value"] },
  { id: "before_after_comparison", name: "Before/After", category: "business", description: "비교 슬라이드", elements: ["title", "content_left", "content_right"] },
  { id: "chart_comparison", name: "차트 비교", category: "business", description: "2개 차트", elements: ["title", "chart_left", "chart_right"] },
  { id: "data_table_slide", name: "데이터 표", category: "business", description: "표 중심", elements: ["title", "table_data"] },
  { id: "timeline_slide", name: "타임라인", category: "business", description: "일정·마일스톤", elements: ["title", "timeline_items"] },
  { id: "process_flow", name: "프로세스", category: "process", description: "단계별 흐름", elements: ["title", "steps"] },
  { id: "agenda_slide", name: "아젠다", category: "process", description: "목차", elements: ["title", "agenda_items"] },
  { id: "quote_testimonial", name: "인용/후기", category: "content", description: "인용문", elements: ["quote", "author"] },
  { id: "team_introduction", name: "팀 소개", category: "team", description: "멤버 소개", elements: ["title", "members"] },
];

export type TemplateSequenceItem = {
  template_id: string;
  content: Record<string, string>;
};

export const PPT_QUICK_SEQUENCES: { id: string; label: string; sequence: TemplateSequenceItem[] }[] = [
  {
    id: "business_review",
    label: "분기 실적 보고",
    sequence: [
      { template_id: "title_slide", content: { title: "분기 실적 보고", subtitle: "Q4 Results", author: "lofice" } },
      { template_id: "agenda_slide", content: { title: "아젠다", agenda_items: "실적 요약\n주요 성과\n향후 계획" } },
      { template_id: "key_metrics_dashboard", content: { title: "핵심 지표", metric_1_value: "94%", metric_2_value: "₩2.4B", metric_3_value: "247" } },
      { template_id: "thank_you_slide", content: { title: "감사합니다", contact: "lofice-one.vercel.app" } },
    ],
  },
  {
    id: "product_pitch",
    label: "제품 소개",
    sequence: [
      { template_id: "title_slide", content: { title: "제품 소개", subtitle: "Our Solution", author: "" } },
      { template_id: "before_after_comparison", content: { title: "변화", content_left: "기존: 수동 처리", content_right: "lofice: 자동화" } },
      { template_id: "process_flow", content: { title: "도입 프로세스", steps: "1. 파일 업로드\n2. 브라우저 편집\n3. 저장·공유" } },
    ],
  },
];
