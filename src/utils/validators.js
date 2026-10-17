import { PRIORITIES } from './constants';

/**
 * Validates task creation / edit payload.
 *
 * @param {Object} fields
 * @param {string} fields.title
 * @param {string} [fields.description]
 * @param {string} fields.priority
 * @param {string|null} [fields.dueDate]
 * @param {string} [createdAt] - ISO timestamp of task creation
 * @param {Array} [existingTasks=[]] - Existing tasks to check duplicates against
 * @param {string|null} [currentTaskId=null] - ID of task being edited, if any
 * @returns {{ isValid: boolean, errors: Record<string, string>, warnings: Record<string, string> }}
 */
export function validateTask(fields, createdAt = null, existingTasks = [], currentTaskId = null) {
  const errors = {};
  const warnings = {};

  // Title validation
  const trimmedTitle = (fields.title || '').trim();
  if (!trimmedTitle) {
    errors.title = 'Task title is required and cannot be empty.';
  } else if (trimmedTitle.length < 2) {
    errors.title = 'Title must be at least 2 characters long.';
  } else if (trimmedTitle.length > 120) {
    errors.title = 'Title must not exceed 120 characters.';
  } else {
    // Check for accidental duplicate title among active tasks
    const duplicate = existingTasks.find(
      (t) =>
        t.id !== currentTaskId &&
        t.title.trim().toLowerCase() === trimmedTitle.toLowerCase() &&
        t.status !== 'completed'
    );
    if (duplicate) {
      warnings.title = 'A pending task with this title already exists.';
    }
  }

  // Description validation (optional)
  if (fields.description && fields.description.length > 1000) {
    errors.description = 'Description cannot exceed 1000 characters.';
  }

  // Priority validation
  const validPriorities = Object.values(PRIORITIES);
  if (!fields.priority || !validPriorities.includes(fields.priority)) {
    errors.priority = `Priority must be one of: ${validPriorities.join(', ')}.`;
  }

  // Due Date validation
  if (fields.dueDate) {
    const dueTime = new Date(fields.dueDate).getTime();
    if (isNaN(dueTime)) {
      errors.dueDate = 'Due date is not a valid date format.';
    } else {
      // Due date must not precede creation timestamp (with a 2-minute buffer)
      const baseTime = createdAt ? new Date(createdAt).getTime() : Date.now();
      const bufferMs = 2 * 60 * 1000; // 2 minutes grace period for clock skew/form entry
      if (dueTime < baseTime - bufferMs) {
        errors.dueDate = 'Due date cannot be set before the creation date & time.';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}
