import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || '';

// Create a proper Supabase client only if credentials are available
let supabase: SupabaseClient;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('[v0] Supabase credentials not configured. Using placeholder client.');
  // Create a dummy client that won't throw errors but won't work either
  // This prevents the app from crashing when credentials aren't set
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: { session: null, user: null }, error: new Error('Supabase not configured') }),
      signUp: async () => ({ data: { session: null, user: null }, error: new Error('Supabase not configured') }),
      signInWithOAuth: async () => ({ data: { provider: '', url: '' }, error: new Error('Supabase not configured') }),
      signInWithOtp: async () => ({ data: { messageId: '' }, error: new Error('Supabase not configured') }),
      verifyOtp: async () => ({ data: { session: null, user: null }, error: new Error('Supabase not configured') }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ data: [], error: null }) }),
      insert: () => ({ error: new Error('Supabase not configured') }),
      delete: () => ({ eq: () => ({ error: new Error('Supabase not configured') }) }),
      upsert: () => ({ error: new Error('Supabase not configured') }),
    }),
  } as unknown as SupabaseClient;
}

export { supabase };

export type Task = {
  id: string;
  user_id: string;
  subject_id: string;
  task_id: string;
  text: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export type DailyTask = {
  id: string;
  user_id: string;
  daily_task_id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export type HistoryEntry = {
  id: string;
  user_id: string;
  date: string;
  stats: Record<string, any>;
  created_at: string;
  updated_at: string;
};
