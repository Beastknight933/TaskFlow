import React, { useState } from 'react';
import { Badge } from '../common/Badge';
import { isOverdue, formatDate, formatRelativeTime } from '../../utils/dateUtils';
import { STATUSES } from '../../utils/constants';
import {
  Calendar,
  Clock,
  Edit3,
  Trash2,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export function TaskCard({ task, onToggleStatus, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCompleted = task.status === STATUSES.COMPLETED;
  const overdue = isOverdue(task);

  const hasLongDescription = task.description && task.description.length > 140;

  return (
    <article
      className={`task-card ${isCompleted ? 'is-completed' : ''} ${overdue ? 'is-overdue' : ''}`}
      aria-label={`Task: ${task.title}`}
    >
      {/* Checkbox for status toggle */}
      <div className="task-checkbox-wrap">
        <button
          type="button"
          role="checkbox"
          aria-checked={isCompleted}
          aria-label={isCompleted ? `Mark "${task.title}" as pending` : `Mark "${task.title}" as completed`}
          className={`task-checkbox ${isCompleted ? 'checked' : ''}`}
          onClick={() => onToggleStatus(task.id)}
        >
          {isCompleted && <Check size={14} strokeWidth={3} aria-hidden="true" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="task-main">
        <div className="task-header-row">
          <div className="task-title-group">
            <h3 className="task-title">{task.title}</h3>
            {task.isDemo && (
              <span
                style={{
                  fontSize: '0.6875rem',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                Sample
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="task-actions">
            <button
              type="button"
              className="action-btn"
              onClick={() => onEdit(task)}
              aria-label={`Edit task "${task.title}"`}
              title="Edit task"
            >
              <Edit3 size={16} />
            </button>
            <button
              type="button"
              className="action-btn delete"
              onClick={() => onDelete(task)}
              aria-label={`Delete task "${task.title}"`}
              title="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <div className="task-description">
            {hasLongDescription && !isExpanded
              ? `${task.description.slice(0, 140)}...`
              : task.description}
            {hasLongDescription && (
              <button
                type="button"
                className="btn-ghost"
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 4px',
                  marginLeft: '6px',
                  color: 'var(--primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                }}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    Show less <ChevronUp size={12} />
                  </>
                ) : (
                  <>
                    Read more <ChevronDown size={12} />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Footer Badges & Meta */}
        <div className="task-footer-meta">
          {/* Priority Badge */}
          <Badge variant={task.priority}>
            {task.priority}
          </Badge>

          {/* Due Date Indicator */}
          {task.dueDate ? (
            <div className={`meta-item ${overdue ? 'overdue' : ''}`}>
              {overdue ? <AlertCircle size={14} /> : <Calendar size={14} />}
              <span title={formatDate(task.dueDate, true)}>
                {overdue
                  ? `Overdue (${formatRelativeTime(task.dueDate)})`
                  : `Due ${formatRelativeTime(task.dueDate)}`}
              </span>
            </div>
          ) : (
            <div className="meta-item">
              <Calendar size={14} />
              <span>No due date</span>
            </div>
          )}

          {/* Created date */}
          <div className="meta-item" title={`Created: ${formatDate(task.createdAt, true)}`}>
            <Clock size={14} />
            <span>Created {formatRelativeTime(task.createdAt)}</span>
          </div>

          {/* Completion timestamp when completed */}
          {isCompleted && task.completedAt && (
            <div
              className="meta-item"
              style={{ color: '#10b981' }}
              title={`Completed: ${formatDate(task.completedAt, true)}`}
            >
              <Check size={14} />
              <span>Completed {formatRelativeTime(task.completedAt)}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
