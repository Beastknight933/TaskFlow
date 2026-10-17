export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const PRIORITY_LABELS = {
  [PRIORITIES.LOW]: 'Low',
  [PRIORITIES.MEDIUM]: 'Medium',
  [PRIORITIES.HIGH]: 'High',
};

export const PRIORITY_WEIGHTS = {
  [PRIORITIES.HIGH]: 3,
  [PRIORITIES.MEDIUM]: 2,
  [PRIORITIES.LOW]: 1,
};

export const STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
};

export const STATUS_LABELS = {
  [STATUSES.PENDING]: 'Pending',
  [STATUSES.COMPLETED]: 'Completed',
};

export const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks_v1',
  THEME: 'taskflow_theme',
  PREFERENCES: 'taskflow_preferences',
  CORRUPT_BACKUP_PREFIX: 'taskflow_corrupt_backup_',
};

export const SCHEMA_VERSION = 1;

export const FILTER_STATUS = {
  ALL: 'all',
  PENDING: 'pending',
  COMPLETED: 'completed',
};

export const FILTER_PRIORITY = {
  ALL: 'all',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const FILTER_DATE = {
  ALL: 'all',
  OVERDUE: 'overdue',
  TODAY: 'today',
  THIS_WEEK: 'week',
  UPCOMING: 'upcoming',
  NO_DUE_DATE: 'no_due_date',
};

export const SORT_FIELDS = {
  DUE_DATE: 'dueDate',
  PRIORITY: 'priority',
  CREATED_AT: 'createdAt',
  TITLE: 'title',
};

export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
};

export const DEFAULT_PREFERENCES = {
  defaultSortField: SORT_FIELDS.DUE_DATE,
  defaultSortOrder: SORT_ORDERS.ASC,
  compactView: false,
};

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
};
