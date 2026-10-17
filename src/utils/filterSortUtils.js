import {
  STATUSES,
  PRIORITY_WEIGHTS,
  FILTER_STATUS,
  FILTER_PRIORITY,
  FILTER_DATE,
  SORT_FIELDS,
  SORT_ORDERS,
} from './constants';
import { isOverdue, isDueToday, isDueThisWeek } from './dateUtils';

/**
 * Filter tasks according to active search, status, priority, and date category.
 *
 * @param {Array} tasks
 * @param {Object} filters
 * @param {string} [filters.search='']
 * @param {string} [filters.status=FILTER_STATUS.ALL]
 * @param {string} [filters.priority=FILTER_PRIORITY.ALL]
 * @param {string} [filters.date=FILTER_DATE.ALL]
 * @param {Date} [now=new Date()]
 * @returns {Array}
 */
export function filterTasks(tasks = [], filters = {}, now = new Date()) {
  const {
    search = '',
    status = FILTER_STATUS.ALL,
    priority = FILTER_PRIORITY.ALL,
    date = FILTER_DATE.ALL,
  } = filters;

  const searchLower = search.trim().toLowerCase();

  return tasks.filter((task) => {
    // 1. Text Search across Title and Description
    if (searchLower) {
      const titleMatch = task.title && task.title.toLowerCase().includes(searchLower);
      const descMatch = task.description && task.description.toLowerCase().includes(searchLower);
      if (!titleMatch && !descMatch) {
        return false;
      }
    }

    // 2. Status Filter
    if (status !== FILTER_STATUS.ALL) {
      if (task.status !== status) {
        return false;
      }
    }

    // 3. Priority Filter
    if (priority !== FILTER_PRIORITY.ALL) {
      if (task.priority !== priority) {
        return false;
      }
    }

    // 4. Due Date Category Filter
    if (date !== FILTER_DATE.ALL) {
      const hasDueDate = Boolean(task.dueDate);

      if (date === FILTER_DATE.NO_DUE_DATE) {
        if (hasDueDate) return false;
      } else if (date === FILTER_DATE.OVERDUE) {
        if (!isOverdue(task, now)) return false;
      } else if (date === FILTER_DATE.TODAY) {
        if (!isDueToday(task, now)) return false;
      } else if (date === FILTER_DATE.THIS_WEEK) {
        if (!isDueThisWeek(task, now)) return false;
      } else if (date === FILTER_DATE.UPCOMING) {
        if (!hasDueDate) return false;
        // Upcoming beyond this week and not overdue
        const dueDate = new Date(task.dueDate);
        const sevenDaysAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        if (dueDate <= sevenDaysAhead || isOverdue(task, now)) return false;
      }
    }

    return true;
  });
}

/**
 * Sorts an array of tasks by specified field and order.
 *
 * @param {Array} tasks
 * @param {string} [sortBy=SORT_FIELDS.DUE_DATE]
 * @param {string} [sortOrder=SORT_ORDERS.ASC]
 * @returns {Array} New sorted array
 */
export function sortTasks(tasks = [], sortBy = SORT_FIELDS.DUE_DATE, sortOrder = SORT_ORDERS.ASC) {
  const multiplier = sortOrder === SORT_ORDERS.DESC ? -1 : 1;

  return [...tasks].sort((a, b) => {
    if (sortBy === SORT_FIELDS.PRIORITY) {
      const weightA = PRIORITY_WEIGHTS[a.priority] || 0;
      const weightB = PRIORITY_WEIGHTS[b.priority] || 0;
      return (weightA - weightB) * multiplier;
    }

    if (sortBy === SORT_FIELDS.DUE_DATE) {
      // Handle tasks with missing due date (always place at end regardless of order)
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      const timeA = new Date(a.dueDate).getTime();
      const timeB = new Date(b.dueDate).getTime();
      return (timeA - timeB) * multiplier;
    }

    if (sortBy === SORT_FIELDS.CREATED_AT) {
      const timeA = new Date(a.createdAt).getTime() || 0;
      const timeB = new Date(b.createdAt).getTime() || 0;
      return (timeA - timeB) * multiplier;
    }

    if (sortBy === SORT_FIELDS.TITLE) {
      return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }) * multiplier;
    }

    return 0;
  });
}

/**
 * Derives comprehensive dashboard metrics from the task list.
 *
 * @param {Array} tasks
 * @param {Date} [now=new Date()]
 * @returns {Object}
 */
export function calculateDashboardStats(tasks = [], now = new Date()) {
  const total = tasks.length;
  let pending = 0;
  let completed = 0;
  let overdue = 0;

  const priorityCounts = {
    high: 0,
    medium: 0,
    low: 0,
  };

  const priorityPendingCounts = {
    high: 0,
    medium: 0,
    low: 0,
  };

  tasks.forEach((task) => {
    if (task.status === STATUSES.COMPLETED) {
      completed++;
    } else {
      pending++;
      if (priorityPendingCounts[task.priority] !== undefined) {
        priorityPendingCounts[task.priority]++;
      }
      if (isOverdue(task, now)) {
        overdue++;
      }
    }

    if (priorityCounts[task.priority] !== undefined) {
      priorityCounts[task.priority]++;
    }
  });

  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Upcoming incomplete tasks with due dates (sorted chronologically)
  const upcomingDeadlines = tasks
    .filter((task) => task.status === STATUSES.PENDING && task.dueDate && !isOverdue(task, now))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  // Recently created or updated tasks
  const recentTasks = [...tasks]
    .sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt).getTime() || 0;
      const timeB = new Date(b.updatedAt || b.createdAt).getTime() || 0;
      return timeB - timeA;
    })
    .slice(0, 5);

  return {
    total,
    pending,
    completed,
    overdue,
    completionPercentage,
    priorityCounts,
    priorityPendingCounts,
    upcomingDeadlines,
    recentTasks,
  };
}
