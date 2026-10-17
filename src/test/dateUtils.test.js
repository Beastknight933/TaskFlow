import { describe, it, expect } from 'vitest';
import {
  isOverdue,
  isDueToday,
  isDueThisWeek,
  formatDate,
  formatRelativeTime,
  toDateTimeLocalInput,
  fromDateTimeLocalInput,
} from '../utils/dateUtils';
import { STATUSES } from '../utils/constants';

describe('dateUtils', () => {
  const fixedNow = new Date('2026-10-17T12:00:00.000Z');

  describe('isOverdue', () => {
    it('returns false for completed tasks even if due date is in the past', () => {
      const task = {
        status: STATUSES.COMPLETED,
        dueDate: '2026-10-16T12:00:00.000Z',
      };
      expect(isOverdue(task, fixedNow)).toBe(false);
    });

    it('returns false for tasks with no due date', () => {
      const task = {
        status: STATUSES.PENDING,
        dueDate: null,
      };
      expect(isOverdue(task, fixedNow)).toBe(false);
    });

    it('returns true for pending tasks with past due date', () => {
      const task = {
        status: STATUSES.PENDING,
        dueDate: '2026-10-16T12:00:00.000Z',
      };
      expect(isOverdue(task, fixedNow)).toBe(true);
    });

    it('returns false for pending tasks with future due date', () => {
      const task = {
        status: STATUSES.PENDING,
        dueDate: '2026-10-18T12:00:00.000Z',
      };
      expect(isOverdue(task, fixedNow)).toBe(false);
    });
  });

  describe('isDueToday', () => {
    it('returns true if due date matches current year, month, and day', () => {
      const task = { dueDate: '2026-10-17T18:00:00.000Z' };
      expect(isDueToday(task, fixedNow)).toBe(true);
    });

    it('returns false if due date is tomorrow', () => {
      const task = { dueDate: '2026-10-18T10:00:00.000Z' };
      expect(isDueToday(task, fixedNow)).toBe(false);
    });
  });

  describe('isDueThisWeek', () => {
    it('returns true if due date is within next 7 days', () => {
      const task = { dueDate: '2026-10-21T12:00:00.000Z' };
      expect(isDueThisWeek(task, fixedNow)).toBe(true);
    });

    it('returns false if due date is 14 days ahead', () => {
      const task = { dueDate: '2026-11-05T12:00:00.000Z' };
      expect(isDueThisWeek(task, fixedNow)).toBe(false);
    });
  });

  describe('datetime input conversions', () => {
    it('converts Date or ISO string to datetime-local input string', () => {
      const dt = new Date(2026, 9, 17, 14, 30); // 17 Oct 2026 14:30
      const formatted = toDateTimeLocalInput(dt);
      expect(formatted).toBe('2026-10-17T14:30');
    });

    it('converts datetime-local input to ISO string', () => {
      const iso = fromDateTimeLocalInput('2026-10-17T14:30');
      expect(iso).toBeTruthy();
      expect(new Date(iso).getFullYear()).toBe(2026);
    });

    it('returns null on empty input', () => {
      expect(fromDateTimeLocalInput('')).toBeNull();
    });
  });
});
