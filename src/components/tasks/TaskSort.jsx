import React from 'react';
import { SORT_FIELDS, SORT_ORDERS } from '../../utils/constants';
import { ArrowDownNarrowWide, ArrowUpWideNarrow } from 'lucide-react';

export function TaskSort({ sortField, sortOrder, onSortChange, onToggleOrder }) {
  const isAsc = sortOrder === SORT_ORDERS.ASC;

  return (
    <div className="filter-group">
      <label htmlFor="task-sort-field" className="sr-only">
        Sort tasks by
      </label>
      <select
        id="task-sort-field"
        className="filter-select"
        value={sortField}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort tasks by field"
      >
        <option value={SORT_FIELDS.DUE_DATE}>Sort: Due Date</option>
        <option value={SORT_FIELDS.PRIORITY}>Sort: Priority</option>
        <option value={SORT_FIELDS.CREATED_AT}>Sort: Creation Date</option>
        <option value={SORT_FIELDS.TITLE}>Sort: Title</option>
      </select>

      <button
        type="button"
        className="btn-icon btn-secondary"
        onClick={onToggleOrder}
        aria-label={`Sort order: ${isAsc ? 'Ascending' : 'Descending'}. Click to toggle.`}
        title={isAsc ? 'Ascending (Click for Descending)' : 'Descending (Click for Ascending)'}
      >
        {isAsc ? <ArrowDownNarrowWide size={18} /> : <ArrowUpWideNarrow size={18} />}
      </button>
    </div>
  );
}
