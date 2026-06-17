-- Phase 1 Office: OOXML canonical path + 암호 힌트
alter table public.documents
  add column if not exists canonical_ooxml_path text,
  add column if not exists office_crypto_hint text
    check (office_crypto_hint is null or office_crypto_hint in ('none', 'encrypted', 'unknown', 'decrypted'));

create index if not exists documents_normalize_status_idx on public.documents (normalize_status);
