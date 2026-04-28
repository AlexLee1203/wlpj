import type { ExerciseFormState, ExerciseLog } from '../types';

export function validateExerciseForm(form: ExerciseFormState): string | null {
  if (!form.name.trim()) {
    return '請輸入運動項目名稱。';
  }

  const duration = Number(form.durationMinutes);
  if (!Number.isInteger(duration) || duration <= 0) {
    return '持續時間必須是大於 0 的整數分鐘。';
  }

  const calories = Number(form.caloriesBurned);
  if (!Number.isFinite(calories) || calories < 0) {
    return '消耗熱量必須是 0 或正數。';
  }

  return null;
}

export function createExerciseLog(form: ExerciseFormState, date: string): ExerciseLog {
  return {
    id: crypto.randomUUID(),
    name: form.name.trim(),
    durationMinutes: Number(form.durationMinutes),
    caloriesBurned: Number(form.caloriesBurned),
    completed: false,
    date
  };
}

export function createExerciseFormState(log?: ExerciseLog): ExerciseFormState {
  if (!log) {
    return {
      name: '',
      durationMinutes: '',
      caloriesBurned: ''
    };
  }

  return {
    name: log.name,
    durationMinutes: String(log.durationMinutes),
    caloriesBurned: String(log.caloriesBurned)
  };
}

export function filterLogsByDate(logs: ExerciseLog[], date: string) {
  return logs.filter((log) => log.date === date);
}

export function getTotalCalories(logs: ExerciseLog[]) {
  return logs.reduce((sum, log) => sum + log.caloriesBurned, 0);
}

export function getCompletedCount(logs: ExerciseLog[]) {
  return logs.filter((log) => log.completed).length;
}

export function getCompletionRate(logs: ExerciseLog[]) {
  if (logs.length === 0) {
    return 0;
  }

  return Math.round((getCompletedCount(logs) / logs.length) * 100);
}

export function sortLogsForDisplay(logs: ExerciseLog[]) {
  return [...logs].sort((left, right) => {
    if (left.completed !== right.completed) {
      return Number(left.completed) - Number(right.completed);
    }

    return left.name.localeCompare(right.name, 'zh-Hant');
  });
}

export function removeExerciseLog(logs: ExerciseLog[], id: string) {
  return logs.filter((log) => log.id !== id);
}

export function removeLogsByDate(logs: ExerciseLog[], date: string) {
  return logs.filter((log) => log.date !== date);
}

export function updateExerciseLog(
  logs: ExerciseLog[],
  id: string,
  form: ExerciseFormState,
  date: string
) {
  return logs.map((log) =>
    log.id === id
      ? {
          ...log,
          name: form.name.trim(),
          durationMinutes: Number(form.durationMinutes),
          caloriesBurned: Number(form.caloriesBurned),
          date
        }
      : log
  );
}
