import { supabase } from '@/lib/supabase';

export async function signInWithSupabase(email: string, password: string) {
  if (!supabase) return { user: null, mode: 'local' as const };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { user: data.user, mode: 'supabase' as const };
}

export async function signUpWithSupabase(email: string, password: string) {
  if (!supabase) return { user: null, mode: 'local' as const };
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return { user: data.user, mode: 'supabase' as const };
}
