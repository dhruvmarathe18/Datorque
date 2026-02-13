import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Singleton instance for client-side usage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabaseInstance: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSupabaseClient(): any {
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
}
