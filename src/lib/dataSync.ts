import { supabase } from './supabase';

// Debounce timer for saving
let saveDebounceTimer: ReturnType<typeof setTimeout> | null = null;

// Generate a random sync code
export function generateSyncCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like 0, O, 1, I
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Get or create sync code
export function getSyncCode(): string {
  let code = localStorage.getItem('sync_code');
  if (!code) {
    code = generateSyncCode();
    localStorage.setItem('sync_code', code);
  }
  return code;
}

// Set sync code (when user enters existing code)
export function setSyncCode(code: string): void {
  localStorage.setItem('sync_code', code.toUpperCase().trim());
}

/**
 * Save tasks to Supabase using sync_code
 */
export async function saveTasks(syncCode: string, tasks: any[]) {
  if (!syncCode) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return;
  }

  try {
    // First, clear existing tasks for this sync code
    await supabase.from('tasks').delete().eq('sync_code', syncCode);

    // Then insert new tasks
    const tasksToInsert = tasks.map((task) => ({
      sync_code: syncCode,
      subject_id: task.subjectId || '',
      task_id: task.id,
      text: task.text,
      completed: task.completed || false,
    }));

    if (tasksToInsert.length > 0) {
      const { error } = await supabase.from('tasks').insert(tasksToInsert);
      if (error) {
        console.error('[v0] Error saving tasks:', error);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
    }
  } catch (error) {
    console.error('[v0] Exception saving tasks:', error);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

/**
 * Save daily tasks to Supabase using sync_code
 */
export async function saveDailyTasks(syncCode: string, dailyTasks: any[]) {
  if (!syncCode) {
    localStorage.setItem('daily-tasks', JSON.stringify(dailyTasks));
    return;
  }

  try {
    await supabase.from('daily_tasks').delete().eq('sync_code', syncCode);

    const tasksToInsert = dailyTasks.map((task) => ({
      sync_code: syncCode,
      daily_task_id: task.id,
      title: task.title,
      completed: task.completed || false,
    }));

    if (tasksToInsert.length > 0) {
      const { error } = await supabase.from('daily_tasks').insert(tasksToInsert);
      if (error) {
        console.error('[v0] Error saving daily tasks:', error);
        localStorage.setItem('daily-tasks', JSON.stringify(dailyTasks));
      }
    }
  } catch (error) {
    console.error('[v0] Exception saving daily tasks:', error);
    localStorage.setItem('daily-tasks', JSON.stringify(dailyTasks));
  }
}

/**
 * Save history to Supabase using sync_code
 */
export async function saveHistory(syncCode: string, history: any) {
  if (!syncCode) {
    localStorage.setItem('history', JSON.stringify(history));
    return;
  }

  try {
    await supabase.from('history').delete().eq('sync_code', syncCode);

    const historyToInsert = Object.entries(history).map(([date, stats]: [string, any]) => ({
      sync_code: syncCode,
      date,
      stats: stats || {},
    }));

    if (historyToInsert.length > 0) {
      const { error } = await supabase.from('history').insert(historyToInsert);
      if (error) {
        console.error('[v0] Error saving history:', error);
        localStorage.setItem('history', JSON.stringify(history));
      }
    }
  } catch (error) {
    console.error('[v0] Exception saving history:', error);
    localStorage.setItem('history', JSON.stringify(history));
  }
}

/**
 * Load tasks from Supabase using sync_code
 */
export async function loadTasks(syncCode: string): Promise<any[]> {
  if (!syncCode) {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  }

  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('sync_code', syncCode);

    if (error) {
      console.error('[v0] Error loading tasks:', error);
      const stored = localStorage.getItem('tasks');
      return stored ? JSON.parse(stored) : [];
    }

    if (data && data.length > 0) {
      return data.map((task: any) => ({
        id: task.task_id,
        subjectId: task.subject_id,
        text: task.text,
        completed: task.completed,
      }));
    }

    return [];
  } catch (error) {
    console.error('[v0] Exception loading tasks:', error);
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  }
}

/**
 * Load daily tasks from Supabase using sync_code
 */
export async function loadDailyTasks(syncCode: string): Promise<any[]> {
  if (!syncCode) {
    const stored = localStorage.getItem('daily-tasks');
    return stored ? JSON.parse(stored) : [];
  }

  try {
    const { data, error } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('sync_code', syncCode);

    if (error) {
      console.error('[v0] Error loading daily tasks:', error);
      const stored = localStorage.getItem('daily-tasks');
      return stored ? JSON.parse(stored) : [];
    }

    if (data && data.length > 0) {
      return data.map((task: any) => ({
        id: task.daily_task_id,
        title: task.title,
        completed: task.completed,
      }));
    }

    return [];
  } catch (error) {
    console.error('[v0] Exception loading daily tasks:', error);
    const stored = localStorage.getItem('daily-tasks');
    return stored ? JSON.parse(stored) : [];
  }
}

/**
 * Load history from Supabase using sync_code
 */
export async function loadHistory(syncCode: string): Promise<Record<string, any>> {
  if (!syncCode) {
    const stored = localStorage.getItem('history');
    return stored ? JSON.parse(stored) : {};
  }

  try {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('sync_code', syncCode);

    if (error) {
      console.error('[v0] Error loading history:', error);
      const stored = localStorage.getItem('history');
      return stored ? JSON.parse(stored) : {};
    }

    if (data && data.length > 0) {
      const result: Record<string, any> = {};
      data.forEach((entry: any) => {
        result[entry.date] = entry.stats;
      });
      return result;
    }

    return {};
  } catch (error) {
    console.error('[v0] Exception loading history:', error);
    const stored = localStorage.getItem('history');
    return stored ? JSON.parse(stored) : {};
  }
}

/**
 * Debounced save function to avoid too many requests
 */
export function debouncedSave(
  saveFunction: (syncCode: string, data: any) => Promise<void>,
  syncCode: string,
  data: any,
  delay: number = 1000
) {
  if (saveDebounceTimer) {
    clearTimeout(saveDebounceTimer);
  }

  saveDebounceTimer = setTimeout(() => {
    saveFunction(syncCode, data);
  }, delay);
}
