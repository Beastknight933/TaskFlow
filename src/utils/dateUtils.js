import { STATUSES } from './constants';

/**
 * Checks whether a task is overdue.
 * Completed tasks are never overdue.
 * Incomplete tasks without a due date are not overdue.
 * An incomplete task is overdue if its due date has passed.
 *
 * @param {Object} task
 * @param {Date} [now=new Date()]
 * @returns {boolean}
 */
export function isOverdue(task, now = new Date()) {
  if (!task || task.status === STATUSES.COMPLETED || !task.dueDate) {
    return false;
  }
  const dueDate = new Date(task.dueDate);
  if (isNaN(dueDate.getTime())) {
    return false;
  }
  return dueDate.getTime() < now.getTime();
}

/**
 * Checks if a task is due today (between 00:00:00 and 23:59:59 of current local date).
 *
 * @param {Object} task
 * @param {Date} [now=new Date()]
 * @returns {boolean}
 */
export function isDueToday(task, now = new Date()) {
  if (!task || !task.dueDate) return false;
  const dueDate = new Date(task.dueDate);
  if (isNaN(dueDate.getTime())) return false;

  return (
    dueDate.getFullYear() === now.getFullYear() &&
    dueDate.getMonth() === now.getMonth() &&
    dueDate.getDate() === now.getDate()
  );
}

/**
 * Checks if a task is due within the next 7 days from now.
 *
 * @param {Object} task
 * @param {Date} [now=new Date()]
 * @returns {boolean}
 */
export function isDueThisWeek(task, now = new Date()) {
  if (!task || !task.dueDate) return false;
  const dueDate = new Date(task.dueDate);
  if (isNaN(dueDate.getTime())) return false;

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const sevenDaysLater = new Date(startOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);

  return dueDate >= startOfToday && dueDate <= sevenDaysLater;
}

/**
 * Formats a date string into human-readable representation.
 *
 * @param {string|Date} dateValue
 * @param {boolean} [includeTime=true]
 * @returns {string}
 */
export function formatDate(dateValue, includeTime = true) {
  if (!dateValue) return 'No date';
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return 'Invalid date';

  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  if (includeTime) {
    options.hour = 'numeric';
    options.minute = '2-digit';
    options.hour12 = true;
  }

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Formats a date relatively (e.g., "in 2 hours", "3 days ago", "Tomorrow at 3:00 PM").
 *
 * @param {string|Date} dateValue
 * @param {Date} [now=new Date()]
 * @returns {string}
 */
export function formatRelativeTime(dateValue, now = new Date()) {
  if (!dateValue) return 'No date';
  const target = new Date(dateValue);
  if (isNaN(target.getTime())) return 'Invalid date';

  const diffMs = target.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHours = Math.round(diffMin / 60);
  const diffDays = Math.round(diffHours / 24);

  // Past
  if (diffMs < 0) {
    const absMin = Math.abs(diffMin);
    const absHours = Math.abs(diffHours);
    const absDays = Math.abs(diffDays);

    if (absMin < 1) return 'Just now';
    if (absMin < 60) return `${absMin}m ago`;
    if (absHours < 24) return `${absHours}h ago`;
    if (absDays === 1) return 'Yesterday';
    if (absDays < 7) return `${absDays}d ago`;
    return formatDate(target, false);
  }

  // Future
  if (diffMin < 60) return `in ${diffMin}m`;
  if (diffHours < 24) return `in ${diffHours}h`;
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `in ${diffDays}d`;
  return formatDate(target, false);
}

/**
 * Converts ISO string or Date to HTML5 datetime-local string (YYYY-MM-DDTHH:mm).
 *
 * @param {string|Date} [dateValue]
 * @returns {string}
 */
export function toDateTimeLocalInput(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return '';

  const pad = (n) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Converts a datetime-local input string to an ISO-8601 string.
 *
 * @param {string} inputVal
 * @returns {string|null}
 */
export function fromDateTimeLocalInput(inputVal) {
  if (!inputVal || !inputVal.trim()) return null;
  const date = new Date(inputVal);
  if (isNaN(date.getTime())) return null;
  return date.toISOString();
}
