import React from 'react';
import { FILTER_STATUS, FILTER_PRIORITY, FILTER_DATE } from '../../utils/constants';

export function TaskFilters({
  status,
  priority,
  date,
  onStatusChange,
  onPriorityChange,
  onDateChange,
}) {
  return (
    <div className="toolbar-controls">
      {/* Status Segmented Control */}
      <div className="filter-pills" role="tablist" aria-label="Filter tasks by completion status">
        <button
          type="button"
          role="tab"
          aria-selected={status === FILTER_STATUS.ALL}
          className={`filter-pill ${status === FILTER_STATUS.ALL ? 'active' : ''}`}
          onClick={() => onStatusChange(FILTER_STATUS.ALL)}
        >
          All
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={status === FILTER_STATUS.PENDING}
          className={`filter-pill ${status === FILTER_STATUS.PENDING ? 'active' : ''}`}
          onClick={() => onStatusChange(FILTER_STATUS.PENDING)}
        >
          Pending
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={status === FILTER_STATUS.COMPLETED}
          className={`filter-pill ${status === FILTER_STATUS.COMPLETED ? 'active' : ''}`}
          onClick={() => onStatusChange(FILTER_STATUS.COMPLETED)}
        >
          Completed
        </button>
      </div>

      {/* Priority Select */}
      <div className="filter-group">
        <label htmlFor="filter-priority-select" className="sr-only">
          Filter by priority
        </label>
        <select
          id="filter-priority-select"
          className="filter-select"
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          aria-label="Filter by priority"
        >
          <option value={FILTER_PRIORITY.ALL}>All Priorities</option>
          <option value={FILTER_PRIORITY.HIGH}>High Priority</option>
          <option value={FILTER_PRIORITY.MEDIUM}>Medium Priority</option>
          <option value={FILTER_PRIORITY.LOW}>Low Priority</option>
        </select>
      </div>

      {/* Due Date Category Select */}
      <div className="filter-group">
        <label htmlFor="filter-date-select" className="sr-only">
          Filter by deadline
        </label>
        <select
          id="filter-date-select"
          className="filter-select"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          aria-label="Filter by deadline"
        >
          <option value={FILTER_DATE.ALL}>All Deadlines</option>
          <option value={FILTER_DATE.OVERDUE}>Overdue</option>
          <option value={FILTER_DATE.TODAY}>Due Today</option>
          <option value={FILTER_DATE.THIS_WEEK}>Due This Week</option>
          <option value={FILTER_DATE.UPCOMING}>Upcoming (Later)</option>
          <option value={FILTER_DATE.NO_DUE_DATE}>No Due Date</option>
        </select>
      </div>
    </div>
  );
}
