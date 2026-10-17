import { describe, it, expect } from 'vitest';
import {
  filterTasks,
  sortTasks,
  calculateDashboardStats,
} from '../utils/filterSortUtils';
import {
  PRIORITIES,
  STATUSES,
  FILTER_STATUS,
  FILTER_PRIORITY,
  FILTER_DATE,
  SORT_FIELDS,
  SORT_ORDERS,
} from '../utils/constants';

describe('filterSortUtils', () => {
  const fixedNow = new Date('2026-10-17T12:00:00.000Z');

  const sampleTaskList = [
    {
      id: '1',
      title: 'Fix Navigation Drawer',
      description: 'CSS transform bug on iOS Safari',
      priority: PRIORITIES.HIGH,
      status: STATUSES.PENDING,
      createdAt: '2026-10-10T10:00:00.000Z',
      dueDate: '2026-10-15T12:00:00.000Z', // Overdue
    },
    {
      id: '2',
      title: 'Design Dark Theme Tokens',
      description: 'Variables and contrast testing',
      priority: PRIORITIES.MEDIUM,
      status: STATUSES.COMPLETED,
      createdAt: '2026-10-11T10:00:00.000Z',
      dueDate: '2026-10-16T12:00:00.000Z', // Past, but completed so NOT overdue
    },
    {
      id: '3',
      title: 'Write Documentation',
      description: 'Setup guides and diagrams',
      priority: PRIORITIES.LOW,
      status: STATUSES.PENDING,
      createdAt: '2026-10-12T10:00:00.000Z',
      dueDate: '2026-10-19T12:00:00.000Z', // Due this week
    },
    {
      id: '4',
      title: 'Database Indexing',
      description: 'Background research',
      priority: PRIORITIES.HIGH,
      status: STATUSES.PENDING,
      createdAt: '2026-10-13T10:00:00.000Z',
      dueDate: null, // No due date
    },
  ];

  describe('filterTasks', () => {
    it('filters by search keyword across title and description', () => {
      const byTitle = filterTasks(sampleTaskList, { search: 'Navigation' }, fixedNow);
      expect(byTitle).toHaveLength(1);
      expect(byTitle[0].id).toBe('1');

      const byDesc = filterTasks(sampleTaskList, { search: 'contrast testing' }, fixedNow);
      expect(byDesc).toHaveLength(1);
      expect(byDesc[0].id).toBe('2');
    });

    it('filters by completion status', () => {
      const pendingOnly = filterTasks(
        sampleTaskList,
        { status: FILTER_STATUS.PENDING },
        fixedNow
      );
      expect(pendingOnly).toHaveLength(3);

      const completedOnly = filterTasks(
        sampleTaskList,
        { status: FILTER_STATUS.COMPLETED },
        fixedNow
      );
      expect(completedOnly).toHaveLength(1);
      expect(completedOnly[0].id).toBe('2');
    });

    it('filters by priority level', () => {
      const highOnly = filterTasks(
        sampleTaskList,
        { priority: FILTER_PRIORITY.HIGH },
        fixedNow
      );
      expect(highOnly).toHaveLength(2);
    });

    it('filters by overdue date status', () => {
      const overdueTasks = filterTasks(
        sampleTaskList,
        { date: FILTER_DATE.OVERDUE },
        fixedNow
      );
      expect(overdueTasks).toHaveLength(1);
      expect(overdueTasks[0].id).toBe('1');
    });

    it('filters by no due date', () => {
      const noDueDateTasks = filterTasks(
        sampleTaskList,
        { date: FILTER_DATE.NO_DUE_DATE },
        fixedNow
      );
      expect(noDueDateTasks).toHaveLength(1);
      expect(noDueDateTasks[0].id).toBe('4');
    });
  });

  describe('sortTasks', () => {
    it('sorts by priority descending (high -> medium -> low)', () => {
      const sorted = sortTasks(sampleTaskList, SORT_FIELDS.PRIORITY, SORT_ORDERS.DESC);
      expect(sorted[0].priority).toBe(PRIORITIES.HIGH);
      expect(sorted[sorted.length - 1].priority).toBe(PRIORITIES.LOW);
    });

    it('sorts by title ascending', () => {
      const sorted = sortTasks(sampleTaskList, SORT_FIELDS.TITLE, SORT_ORDERS.ASC);
      expect(sorted[0].title).toBe('Database Indexing');
      expect(sorted[sorted.length - 1].title).toBe('Write Documentation');
    });

    it('sorts by due date ascending with nulls placed at end', () => {
      const sorted = sortTasks(sampleTaskList, SORT_FIELDS.DUE_DATE, SORT_ORDERS.ASC);
      expect(sorted[0].id).toBe('1'); // 2026-10-15
      expect(sorted[sorted.length - 1].dueDate).toBeNull(); // task 4 has null dueDate
    });
  });

  describe('calculateDashboardStats', () => {
    it('computes accurate real-time metrics', () => {
      const stats = calculateDashboardStats(sampleTaskList, fixedNow);

      expect(stats.total).toBe(4);
      expect(stats.pending).toBe(3);
      expect(stats.completed).toBe(1);
      expect(stats.overdue).toBe(1); // Task 1 only (task 2 is completed)
      expect(stats.completionPercentage).toBe(25); // 1 / 4 = 25%
      expect(stats.priorityCounts.high).toBe(2);
      expect(stats.priorityCounts.medium).toBe(1);
      expect(stats.priorityCounts.low).toBe(1);
      expect(stats.priorityPendingCounts.high).toBe(2);
    });

    it('handles empty task list gracefully without dividing by zero', () => {
      const stats = calculateDashboardStats([], fixedNow);
      expect(stats.total).toBe(0);
      expect(stats.pending).toBe(0);
      expect(stats.completed).toBe(0);
      expect(stats.overdue).toBe(0);
      expect(stats.completionPercentage).toBe(0);
      expect(stats.upcomingDeadlines).toHaveLength(0);
    });
  });
});
