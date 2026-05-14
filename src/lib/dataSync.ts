import { supabase, Task, DailyTask, HistoryEntry } from './supabase';

// Debounce timer for saving
let saveDebounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Save tasks to Supabase, with automatic fallback to localStorage
 */
export async function saveTasks(userId: string, tasks: any[]) {
  if (!userId) {
    // Fallback to localStorage if no user
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return;
  }

  try {
    // First, clear existing tasks for this user
    await supabase.from('tasks').delete().eq('user_id', userId);

    // Then insert new tasks
    const tasksToInsert = tasks.map((task) => ({
      user_id: userId,
      subject_id: task.subjectId || '',
      task_id: task.id,
      text: task.text,
      completed: task.completed || false,
    }));

    if (tasksToInsert.length > 0) {
      const { error } = await supabase.from('tasks').insert(tasksToInsert);
      if (error) {
        console.error('[v0] Error saving tasks:', error);
        // Fallback to localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
    }
  } catch (error) {
    console.error('[v0] Exception saving tasks:', error);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

/**
 * Save daily tasks to Supabase
 */
export async function saveDailyTasks(userId: string, dailyTasks: any[]) {
  if (!userId) {
    localStorage.setItem('daily-tasks', JSON.stringify(dailyTasks));
    return;
  }

  try {
    await supabase.from('daily_tasks').delete().eq('user_id', userId);

    const tasksToInsert = dailyTasks.map((task) => ({
      user_id: userId,
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
 * Save history to Supabase
 */
export async function saveHistory(userId: string, history: any) {
  if (!userId) {
    localStorage.setItem('history', JSON.stringify(history));
    return;
  }

  try {
    await supabase.from('history').delete().eq('user_id', userId);

    const historyToInsert = Object.entries(history).map(([date, stats]: [string, any]) => ({
      user_id: userId,
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
 * Load tasks from Supabase, with fallback to localStorage
 */
export async function loadTasks(userId: string): Promise<any[]> {
  if (!userId) {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  }

  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('[v0] Error loading tasks:', error);
      const stored = localStorage.getItem('tasks');
      return stored ? JSON.parse(stored) : [];
    }

    if (data && data.length > 0) {
      // Convert database format back to app format
      return data.map((task: Task) => ({
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
 * Load daily tasks from Supabase
 */
export async function loadDailyTasks(userId: string): Promise<any[]> {
  if (!userId) {
    const stored = localStorage.getItem('daily-tasks');
    return stored ? JSON.parse(stored) : [];
  }

  try {
    const { data, error } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('[v0] Error loading daily tasks:', error);
      const stored = localStorage.getItem('daily-tasks');
      return stored ? JSON.parse(stored) : [];
    }

    if (data && data.length > 0) {
      return data.map((task: DailyTask) => ({
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
 * Load history from Supabase
 */
export async function loadHistory(userId: string): Promise<Record<string, any>> {
  if (!userId) {
    const stored = localStorage.getItem('history');
    return stored ? JSON.parse(stored) : {};
  }

  try {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('[v0] Error loading history:', error);
      const stored = localStorage.getItem('history');
      return stored ? JSON.parse(stored) : {};
    }

    if (data && data.length > 0) {
      const result: Record<string, any> = {};
      data.forEach((entry: HistoryEntry) => {
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
  saveFunction: (userId: string, data: any) => Promise<void>,
  userId: string,
  data: any,
  delay: number = 1000
) {
  if (saveDebounceTimer) {
    clearTimeout(saveDebounceTimer);
  }

  saveDebounceTimer = setTimeout(() => {
    saveFunction(userId, data);
  }, delay);
}
