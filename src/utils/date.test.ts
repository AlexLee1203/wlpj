import { describe, expect, it } from 'vitest';
import { formatDateLabel, shiftDate } from './date';

describe('date helpers', () => {
  it('moves backward by one day without skipping', () => {
    expect(shiftDate('2026-04-28', -1)).toBe('2026-04-27');
  });

  it('moves forward by one day without stalling', () => {
    expect(shiftDate('2026-04-28', 1)).toBe('2026-04-29');
  });

  it('handles month boundaries in local time', () => {
    expect(shiftDate('2026-05-01', -1)).toBe('2026-04-30');
  });

  it('formats readable date labels', () => {
    expect(formatDateLabel('2026-04-28')).toContain('4月');
  });
});
