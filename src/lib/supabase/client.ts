import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}

export const BUCKET = "documents";

export async function uploadDocument(file: File, userId?: string) {
  const supabase = createClient();
  if (!supabase) return null;
  const path = `${userId ?? "anonymous"}/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage.from(BUCKET).upload(path, file);
  if (error) throw error;
  return data.path;
}

export async function downloadDocument(path: string): Promise<Blob | null> {
  const supabase = createClient();
  if (!supabase) return null;
  const { data, error } = await supabase.storage.from(BUCKET).download(path);
  if (error) throw error;
  return data;
}

export async function listCloudDocuments(userId?: string) {
  const supabase = createClient();
  if (!supabase) return [];
  const { data, error } = await supabase.storage.from(BUCKET).list(userId ?? "anonymous");
  if (error) return [];
  return data ?? [];
}
