import type { ExerciseLog } from '../types';

const STORAGE_KEY = 'weight-loss-planner-logs';

export function parseLogsJson(raw: string): ExerciseLog[] | null {
  try {
    const parsed = JSON.parse(raw) as ExerciseLog[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function readLogs(): ExerciseLog[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  const parsed = parseLogsJson(raw);
  if (!parsed) {
    return [];
  }

  return parsed;
}

export function serializeLogs(logs: ExerciseLog[]) {
  return JSON.stringify(logs, null, 2);
}

export function createBackupFilename(date = new Date()) {
  return `weight-loss-planner-backup-${date.toISOString().slice(0, 10)}.json`;
}

export function downloadLogsBackup(logs: ExerciseLog[]) {
  const blob = new Blob([serializeLogs(logs)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = createBackupFilename();
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

export function importLogsFromText(raw: string): ExerciseLog[] {
  const parsed = parseLogsJson(raw);
  if (!parsed) {
    throw new Error('備份檔格式錯誤，請選擇正確的 JSON 檔案。');
  }

  return parsed;
}

export function writeLogs(logs: ExerciseLog[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}
