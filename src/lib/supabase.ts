import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('[v0] Supabase credentials not configured. Auth features will be limited.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

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
