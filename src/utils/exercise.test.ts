import { describe, expect, it } from 'vitest';
import type { ExerciseFormState, ExerciseLog } from '../types';
import {
  createExerciseFormState,
  filterLogsByDate,
  getCompletedCount,
  getCompletionRate,
  getTotalCalories,
  removeExerciseLog,
  removeLogsByDate,
  sortLogsForDisplay,
  updateExerciseLog,
  validateExerciseForm
} from './exercise';
import {
  createBackupFilename,
  importLogsFromText,
  parseLogsJson,
  serializeLogs
} from './storage';

const sampleLogs: ExerciseLog[] = [
  {
    id: '1',
    name: '跳繩',
    durationMinutes: 20,
    caloriesBurned: 180,
    completed: false,
    date: '2026-04-28'
  },
  {
    id: '2',
    name: '快走',
    durationMinutes: 30,
    caloriesBurned: 220,
    completed: true,
    date: '2026-04-28'
  },
  {
    id: '3',
    name: '瑜伽',
    durationMinutes: 40,
    caloriesBurned: 120,
    completed: true,
    date: '2026-04-27'
  }
];

describe('validateExerciseForm', () => {
  it('rejects empty names', () => {
    expect(
      validateExerciseForm({
        name: '   ',
        durationMinutes: '30',
        caloriesBurned: '120'
      })
    ).toBe('請輸入運動項目名稱。');
  });

  it('accepts valid input', () => {
    expect(
      validateExerciseForm({
        name: '快走',
        durationMinutes: '30',
        caloriesBurned: '120'
      })
    ).toBeNull();
  });
});

describe('exercise data helpers', () => {
  it('filters logs by date', () => {
    expect(filterLogsByDate(sampleLogs, '2026-04-28')).toHaveLength(2);
  });

  it('calculates calories, completed count, and completion rate', () => {
    const filtered = filterLogsByDate(sampleLogs, '2026-04-28');
    expect(getTotalCalories(filtered)).toBe(400);
    expect(getCompletedCount(filtered)).toBe(1);
    expect(getCompletionRate(filtered)).toBe(50);
  });

  it('returns zero completion rate for empty logs', () => {
    expect(getCompletionRate([])).toBe(0);
  });

  it('sorts incomplete logs before completed logs', () => {
    const sorted = sortLogsForDisplay(sampleLogs);
    expect(sorted.map((log) => log.id)).toEqual(['1', '2', '3']);
  });

  it('removes a target log by id', () => {
    expect(removeExerciseLog(sampleLogs, '2').map((log) => log.id)).toEqual(['1', '3']);
  });

  it('removes logs by selected date', () => {
    expect(removeLogsByDate(sampleLogs, '2026-04-28').map((log) => log.id)).toEqual(['3']);
  });

  it('updates a target log from form state', () => {
    const form: ExerciseFormState = {
      name: '慢跑',
      durationMinutes: '45',
      caloriesBurned: '320'
    };

    const updated = updateExerciseLog(sampleLogs, '1', form, '2026-04-29');
    expect(updated[0]).toMatchObject({
      name: '慢跑',
      durationMinutes: 45,
      caloriesBurned: 320,
      date: '2026-04-29'
    });
  });

  it('creates a form state from a log', () => {
    expect(createExerciseFormState(sampleLogs[0])).toEqual({
      name: '跳繩',
      durationMinutes: '20',
      caloriesBurned: '180'
    });
  });
});

describe('storage helpers', () => {
  it('serializes and parses logs JSON', () => {
    const serialized = serializeLogs(sampleLogs);
    expect(parseLogsJson(serialized)).toEqual(sampleLogs);
  });

  it('returns null for invalid JSON content', () => {
    expect(parseLogsJson('{oops')).toBeNull();
  });

  it('imports logs from valid backup text', () => {
    expect(importLogsFromText(JSON.stringify(sampleLogs))).toEqual(sampleLogs);
  });

  it('throws for invalid backup text', () => {
    expect(() => importLogsFromText('not-json')).toThrow(
      '備份檔格式錯誤，請選擇正確的 JSON 檔案。'
    );
  });

  it('creates a stable backup filename', () => {
    expect(createBackupFilename(new Date('2026-04-28T10:00:00.000Z'))).toBe(
      'weight-loss-planner-backup-2026-04-28.json'
    );
  });
});
