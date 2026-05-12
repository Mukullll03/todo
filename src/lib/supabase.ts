import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

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
