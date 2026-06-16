-- lofice Supabase Storage Setup
-- Run this in Supabase SQL Editor

INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow anonymous uploads"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Allow anonymous reads"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'documents');

CREATE POLICY "Allow anonymous updates"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'documents');

CREATE POLICY "Allow anonymous deletes"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'documents');
