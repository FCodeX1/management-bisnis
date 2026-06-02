import { supabase } from '@/lib/supabase';
import { fileToDataUrl } from '@/lib/utils';

export async function uploadImage(file: File, bucket = 'business-assets') {
  if (!supabase) return fileToDataUrl(file);
  const path = `${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
