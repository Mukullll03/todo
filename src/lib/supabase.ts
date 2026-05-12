import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('[v0] Supabase initialized successfully');
} else {
  // Fallback mock client for offline mode
  console.warn('[v0] Supabase credentials not configured. Running in offline mode.');
  supabase = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      insert: async () => ({ data: null, error: null }),
      update: async () => ({ data: null, error: null }),
      select: async () => ({ data: [], error: null }),
      eq: () => ({ select: async () => ({ data: null, error: null }) }),
    }),
  };
}

export const supabase = supabase;

export type DailyData = {
  id: string;
  user_id: string;
  date: string;
  completed_tasks: string[];
  total_tasks_planned: number;
  created_at: string;
  updated_at: string;
};

export type DailyBlueprint = {
  id: string;
  user_id: string;
  date: string;
  blueprint_tasks: any[];
  completed_at: boolean;
  created_at: string;
  updated_at: string;
};

export type StudyHistory = {
  id: string;
  user_id: string;
  date: string;
  task_count: number;
  subjects: any[];
  created_at: string;
};
