import React from 'react';
import { TaskCard } from './TaskCard';
import { TaskSearchBar } from './TaskSearchBar';
import { TaskFilters } from './TaskFilters';
import { TaskSort } from './TaskSort';
import { EmptyState } from '../common/EmptyState';
import { useTasks } from '../../hooks/useTasks';
import { PlusCircle, SearchX, CheckCircle2, RotateCcw } from 'lucide-react';

export function TaskList() {
  const {
    tasks,
    filteredAndSortedTasks,
    filters,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    setDateFilter,
    clearFilters,
    isFiltersActive,
    sort,
    setSort,
    toggleSortOrder,
    toggleTaskStatus,
    openCreateModal,
    openEditModal,
    openDeleteDialog,
  } = useTasks();

  const totalCount = tasks.length;
  const filteredCount = filteredAndSortedTasks.length;

  return (
    <div className="task-list-view">
      {/* Search, Filter & Sort Toolbar */}
      <div className="tasks-toolbar">
        <div className="toolbar-primary">
          <TaskSearchBar
            value={filters.search}
            onChange={setSearch}
            onClear={() => setSearch('')}
          />
          <TaskFilters
            status={filters.status}
            priority={filters.priority}
            date={filters.date}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
            onDateChange={setDateFilter}
          />
          <TaskSort
            sortField={sort.field}
            sortOrder={sort.order}
            onSortChange={(field) => setSort(field, sort.order)}
            onToggleOrder={toggleSortOrder}
          />
        </div>

        {/* Results summary and active filter indicators */}
        <div className="results-summary-bar">
          <div>
            <span>
              Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong>{' '}
              {totalCount === 1 ? 'task' : 'tasks'}
            </span>
          </div>
          {isFiltersActive && (
            <button
              type="button"
              className="clear-filters-btn"
              onClick={clearFilters}
              aria-label="Reset all search queries and active filters"
            >
              <RotateCcw size={14} />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Task Cards or Empty State */}
      {totalCount === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No tasks yet"
          description="Stay organized, track deadlines, and accomplish your goals. Create your first task to get started."
          actionLabel="Create Task"
          actionIcon={PlusCircle}
          onAction={openCreateModal}
        />
      ) : filteredCount === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No matching tasks found"
          description="No tasks matched your current search criteria or active filters. Try adjusting or clearing your filters."
          actionLabel="Clear Filters"
          actionIcon={RotateCcw}
          onAction={clearFilters}
        />
      ) : (
        <div className="task-cards-list" role="feed" aria-label="Task List">
          {filteredAndSortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={toggleTaskStatus}
              onEdit={openEditModal}
              onDelete={openDeleteDialog}
            />
          ))}
        </div>
      )}
    </div>
  );
}
