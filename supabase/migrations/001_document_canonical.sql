-- Phase 1: documents 메타 + Storage 이중 저장
-- Supabase Dashboard → SQL Editor에서 실행하거나 `supabase db push`

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  local_id text not null unique,
  file_name text not null,
  format text not null,
  mime_type text,
  original_storage_path text,
  canonical_hwpx_path text,
  dvc_score numeric,
  dvc_report jsonb,
  normalize_status text not null default 'pending'
    check (normalize_status in ('pending', 'ok', 'failed', 'skipped')),
  normalize_error text,
  size_bytes bigint default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists documents_local_id_idx on public.documents (local_id);
create index if not exists documents_format_idx on public.documents (format);

alter table public.documents enable row level security;

-- 익명 키: insert/update/select 허용 (프로덕션에서는 auth.uid() 기반으로 강화 권장)
create policy "documents_anon_all"
  on public.documents
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- Storage bucket (Dashboard에서 bucket 생성 후 정책 적용)
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "documents_storage_anon_rw"
  on storage.objects
  for all
  to anon, authenticated
  using (bucket_id = 'documents')
  with check (bucket_id = 'documents');
