import { supabase } from '../../lib/supabase';
import type { ExerciseLogInsert, ExerciseLogRow } from './types';

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase 尚未設定，請先填入 VITE_SUPABASE_URL 與 VITE_SUPABASE_ANON_KEY。');
  }

  return supabase as any;
}

export async function listExerciseLogs() {
  const client = requireSupabase();
  const { data, error } = await client
    .from('exercise_logs')
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as ExerciseLogRow[];
}

export async function createExerciseLogRemote(input: ExerciseLogInsert) {
  const client = requireSupabase();
  const { data, error } = await client.from('exercise_logs').insert(input).select().single();

  if (error) {
    throw error;
  }

  return data as ExerciseLogRow;
}

export async function updateExerciseLogRemote(
  id: string,
  input: Partial<ExerciseLogInsert> & { completed?: boolean }
) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('exercise_logs')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as ExerciseLogRow;
}

export async function deleteExerciseLogRemote(id: string) {
  const client = requireSupabase();
  const { error } = await client.from('exercise_logs').delete().eq('id', id);

  if (error) {
    throw error;
  }
}

export async function deleteExerciseLogsByDateRemote(date: string) {
  const client = requireSupabase();
  const { error } = await client.from('exercise_logs').delete().eq('date', date);

  if (error) {
    throw error;
  }
}

export function subscribeExerciseLogs(onChange: (payload: unknown) => void) {
  const client = requireSupabase();

  const channel = client
    .channel('exercise-logs-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'exercise_logs'
      },
      onChange
    )
    .subscribe();

  return () => {
    void client.removeChannel(channel);
  };
}
