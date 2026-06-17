-- Phase 1 Office: documents 테이블 Office canonical 경로 확장

alter table public.documents
  add column if not exists canonical_docx_path text,
  add column if not exists canonical_xlsx_path text,
  add column if not exists canonical_pptx_path text;

create index if not exists documents_normalize_status_idx on public.documents (normalize_status);
