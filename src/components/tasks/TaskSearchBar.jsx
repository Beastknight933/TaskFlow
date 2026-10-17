import React from 'react';
import { Search, X } from 'lucide-react';

export function TaskSearchBar({ value, onChange, onClear, placeholder = 'Search tasks by title or description...' }) {
  return (
    <div className="toolbar-search">
      <Search className="header-search-icon" size={18} aria-hidden="true" />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search tasks"
      />
      {value && (
        <button
          type="button"
          className="header-search-clear"
          onClick={onClear}
          aria-label="Clear task search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
