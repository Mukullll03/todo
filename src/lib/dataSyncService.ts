import { supabase } from './supabase';

export class DataSyncService {
  /**
   * Sync completed syllabus tasks
   */
  static async syncCompletedTasks(userId: string, completedTasks: string[], date: string = new Date().toDateString()) {
    try {
      const dateObj = new Date(date);
      const dateStr = dateObj.toISOString().split('T')[0];

      // Check if record exists for this user and date
      const { data: existing } = await supabase
        .from('study_history')
        .select('id')
        .eq('user_id', userId)
        .eq('date', dateStr)
        .maybeSingle();

      if (existing) {
        // Update existing record
        return await supabase
          .from('study_history')
          .update({
            completed_syllabus_tasks: completedTasks,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select();
      } else {
        // Create new record
        return await supabase
          .from('study_history')
          .insert({
            user_id: userId,
            date: dateStr,
            completed_syllabus_tasks: completedTasks,
            completed_daily_tasks: [],
          })
          .select();
      }
    } catch (error) {
      console.error('[DataSync] Error syncing completed tasks:', error);
      throw error;
    }
  }

  /**
   * Sync daily tasks
   */
  static async syncDailyTasks(userId: string, dailyTasks: string[]) {
    try {
      const dateStr = new Date().toISOString().split('T')[0];

      const { data: existing } = await supabase
        .from('study_history')
        .select('id')
        .eq('user_id', userId)
        .eq('date', dateStr)
        .maybeSingle();

      if (existing) {
        return await supabase
          .from('study_history')
          .update({
            completed_daily_tasks: dailyTasks,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select();
      } else {
        return await supabase
          .from('study_history')
          .insert({
            user_id: userId,
            date: dateStr,
            completed_syllabus_tasks: [],
            completed_daily_tasks: dailyTasks,
          })
          .select();
      }
    } catch (error) {
      console.error('[DataSync] Error syncing daily tasks:', error);
      throw error;
    }
  }

  /**
   * Load all user's study history
   */
  static async loadStudyHistory(userId: string) {
    try {
      const { data, error } = await supabase
        .from('study_history')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[DataSync] Error loading study history:', error);
      return [];
    }
  }

  /**
   * Get today's data
   */
  static async getTodayData(userId: string) {
    try {
      const dateStr = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('study_history')
        .select('*')
        .eq('user_id', userId)
        .eq('date', dateStr)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[DataSync] Error getting today data:', error);
      return null;
    }
  }

  /**
   * Sync history for a specific date
   */
  static async syncHistoryForDate(
    userId: string,
    date: string,
    completedSyllabus: string[],
    completedDaily: string[]
  ) {
    try {
      const dateStr = new Date(date).toISOString().split('T')[0];

      const { data: existing } = await supabase
        .from('study_history')
        .select('id')
        .eq('user_id', userId)
        .eq('date', dateStr)
        .maybeSingle();

      if (existing) {
        return await supabase
          .from('study_history')
          .update({
            completed_syllabus_tasks: completedSyllabus,
            completed_daily_tasks: completedDaily,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select();
      } else {
        return await supabase
          .from('study_history')
          .insert({
            user_id: userId,
            date: dateStr,
            completed_syllabus_tasks: completedSyllabus,
            completed_daily_tasks: completedDaily,
          })
          .select();
      }
    } catch (error) {
      console.error('[DataSync] Error syncing history for date:', error);
      throw error;
    }
  }

  /**
   * Rebuild completedTasks from study_history
   */
  static async rebuildCompletedTasksFromHistory(userId: string) {
    try {
      const history = await this.loadStudyHistory(userId);
      const allCompletedTasks = new Set<string>();

      history.forEach((record) => {
        if (record.completed_syllabus_tasks) {
          record.completed_syllabus_tasks.forEach((taskId) => {
            allCompletedTasks.add(taskId);
          });
        }
      });

      return Array.from(allCompletedTasks);
    } catch (error) {
      console.error('[DataSync] Error rebuilding completed tasks:', error);
      return [];
    }
  }

  /**
   * Rebuild daily history from study_history
   */
  static async rebuildDailyHistoryFromRecords(userId: string) {
    try {
      const history = await this.loadStudyHistory(userId);
      const dailyHistory: Record<string, string[]> = {};

      history.forEach((record) => {
        const dateStr = new Date(record.date).toDateString();
        dailyHistory[dateStr] = record.completed_daily_tasks || [];
      });

      return dailyHistory;
    } catch (error) {
      console.error('[DataSync] Error rebuilding daily history:', error);
      return {};
    }
  }

  /**
   * Rebuild syllabus history from study_history
   */
  static async rebuildSyllabusHistoryFromRecords(userId: string) {
    try {
      const history = await this.loadStudyHistory(userId);
      const syllabusHistory: Record<string, string[]> = {};

      history.forEach((record) => {
        const dateStr = new Date(record.date).toDateString();
        syllabusHistory[dateStr] = record.completed_syllabus_tasks || [];
      });

      return syllabusHistory;
    } catch (error) {
      console.error('[DataSync] Error rebuilding syllabus history:', error);
      return {};
    }
  }
}
