import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Tables = {
  daily_data: {
    Row: {
      id: string;
      user_id: string;
      date: string;
      completed_tasks: string[];
      total_tasks_planned: number;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      user_id: string;
      date: string;
      completed_tasks?: string[];
      total_tasks_planned?: number;
      created_at?: string;
      updated_at?: string;
    };
  };
  daily_blueprint: {
    Row: {
      id: string;
      user_id: string;
      date: string;
      blueprint_tasks: Record<string, unknown>;
      completed_at: boolean;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      user_id: string;
      date: string;
      blueprint_tasks?: Record<string, unknown>;
      completed_at?: boolean;
      created_at?: string;
      updated_at?: string;
    };
  };
  study_history: {
    Row: {
      id: string;
      user_id: string;
      date: string;
      completed_syllabus_tasks: string[];
      completed_daily_tasks: string[];
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      user_id: string;
      date: string;
      completed_syllabus_tasks?: string[];
      completed_daily_tasks?: string[];
      created_at?: string;
      updated_at?: string;
    };
  };
};
