import { useEffect, useCallback } from 'react';
import { supabase, DailyData, DailyBlueprint } from './supabase';

export const useDataSync = (
  userId: string | undefined,
  onDataLoaded: (data: any) => void
) => {
  // Save daily data to Supabase
  const saveDailyData = useCallback(
    async (completedTasks: string[]) => {
      if (!userId) return;

      const today = new Date().toISOString().split('T')[0];

      try {
        const { data: existing } = await supabase
          .from('daily_data')
          .select('*')
          .eq('user_id', userId)
          .eq('date', today)
          .single();

        if (existing) {
          await supabase
            .from('daily_data')
            .update({
              completed_tasks: completedTasks,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);
        } else {
          await supabase.from('daily_data').insert({
            user_id: userId,
            date: today,
            completed_tasks: completedTasks,
            total_tasks_planned: completedTasks.length,
          });
        }
      } catch (error) {
        console.error('[v0] Error saving daily data:', error);
      }
    },
    [userId]
  );

  // Save daily blueprint
  const saveDailyBlueprint = useCallback(
    async (blueprintTasks: any[], completed: boolean = false) => {
      if (!userId) return;

      const today = new Date().toISOString().split('T')[0];

      try {
        const { data: existing } = await supabase
          .from('daily_blueprint')
          .select('*')
          .eq('user_id', userId)
          .eq('date', today)
          .single();

        if (existing) {
          await supabase
            .from('daily_blueprint')
            .update({
              blueprint_tasks: blueprintTasks,
              completed_at: completed,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);
        } else {
          await supabase.from('daily_blueprint').insert({
            user_id: userId,
            date: today,
            blueprint_tasks: blueprintTasks,
            completed_at: completed,
          });
        }
      } catch (error) {
        console.error('[v0] Error saving blueprint:', error);
      }
    },
    [userId]
  );

  // Save study history
  const saveStudyHistory = useCallback(
    async (taskCount: number, subjects: string[]) => {
      if (!userId) return;

      const today = new Date().toISOString().split('T')[0];

      try {
        const { data: existing } = await supabase
          .from('study_history')
          .select('*')
          .eq('user_id', userId)
          .eq('date', today)
          .single();

        if (!existing) {
          await supabase.from('study_history').insert({
            user_id: userId,
            date: today,
            task_count: taskCount,
            subjects: subjects,
          });
        }
      } catch (error) {
        console.error('[v0] Error saving history:', error);
      }
    },
    [userId]
  );

  // Load today's data from Supabase
  const loadTodayData = useCallback(async () => {
    if (!userId) return;

    const today = new Date().toISOString().split('T')[0];

    try {
      const [dailyDataRes, blueprintRes] = await Promise.all([
        supabase
          .from('daily_data')
          .select('*')
          .eq('user_id', userId)
          .eq('date', today)
          .single(),
        supabase
          .from('daily_blueprint')
          .select('*')
          .eq('user_id', userId)
          .eq('date', today)
          .single(),
      ]);

      onDataLoaded({
        dailyData: dailyDataRes.data,
        blueprint: blueprintRes.data,
      });
    } catch (error) {
      console.error('[v0] Error loading data:', error);
    }
  }, [userId, onDataLoaded]);

  // Load data on mount
  useEffect(() => {
    loadTodayData();
  }, [loadTodayData]);

  return {
    saveDailyData,
    saveDailyBlueprint,
    saveStudyHistory,
    loadTodayData,
  };
};
