import { describe, expect, it } from 'vitest';
import {
  formatDate,
  formatDuration,
  formatList,
  formatRange,
  formatYearMonth,
  monthsBetween,
  parseYearMonth,
} from '../../src/i18n/format.ts';

describe('locale date formatting', () => {
  it('parses ISO year-months and rejects anything else', () => {
    expect(parseYearMonth('2024-07')).toEqual({ year: 2024, month: 7 });
    expect(() => parseYearMonth('07.2024')).toThrow();
    expect(() => parseYearMonth('2024-13')).toThrow();
  });

  it('formats year-months per locale', () => {
    expect(formatYearMonth('2024-07', 'en')).toBe('Jul 2024');
    expect(formatYearMonth('2025-12', 'en')).toBe('Dec 2025');
    expect(formatYearMonth('2024-07', 'de')).toBe('Juli 2024');
    expect(formatYearMonth('2025-12', 'de')).toBe('Dez. 2025');
    expect(formatYearMonth('2019-03', 'de')).toBe('März 2019');
    expect(formatYearMonth('2024-07', 'en', 'long')).toBe('July 2024');
    expect(formatYearMonth('2024-07', 'de', 'numeric')).toBe('07/2024');
  });

  it('formats ranges, open ends and placeholders', () => {
    expect(formatRange('2024-07', '2025-12', 'en')).toBe('Jul 2024 – Dec 2025');
    expect(formatRange('2024-07', '2025-12', 'de')).toBe('Juli 2024 – Dez. 2025');
    expect(formatRange('2025-01', null, 'en')).toBe('Jan 2025 – Present');
    expect(formatRange('2025-01', null, 'de')).toBe('Jan. 2025 – heute');
    expect(formatYearMonth('[CONFIRM: start date]', 'en')).toBe('[CONFIRM: start date]');
  });

  it('counts months inclusively and formats durations', () => {
    expect(monthsBetween('2024-07', '2025-12')).toBe(18);
    expect(formatDuration('2024-07', '2025-12', 'en')).toBe('1 yr 6 mos');
    expect(formatDuration('2024-07', '2025-12', 'de')).toBe('1 J. 6 Mon.');
    expect(formatDuration('2018-08', '2018-09', 'en')).toBe('2 mos');
    expect(formatDuration('2021-08', '2024-06', 'en')).toBe('2 yrs 11 mos');
  });

  it('formats dates and lists', () => {
    const date = new Date(Date.UTC(2026, 10, 1));
    expect(formatDate(date, 'en')).toBe('1 November 2026');
    expect(formatDate(date, 'de')).toBe('1. November 2026');
    expect(formatList(['A', 'B', 'C'], 'en')).toBe('A, B and C');
    expect(formatList(['A', 'B', 'C'], 'de')).toBe('A, B und C');
  });
});
