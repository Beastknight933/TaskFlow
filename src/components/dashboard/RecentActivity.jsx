import React from 'react';
import { formatRelativeTime } from '../../utils/dateUtils';
import { STATUSES } from '../../utils/constants';
import { Clock, CheckCircle2, CircleDot } from 'lucide-react';

export function RecentActivity({ tasks = [], onSelectTask }) {
  if (tasks.length === 0) {
    return (
      <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Clock size={32} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
        <p style={{ fontSize: '0.875rem' }}>No recent activity logged yet.</p>
      </div>
    );
  }

  return (
    <div className="mini-task-list">
      {tasks.map((task) => {
        const isCompleted = task.status === STATUSES.COMPLETED;
        const timestamp = task.updatedAt || task.createdAt;

        return (
          <div
            key={task.id}
            className="mini-task-item"
            onClick={() => onSelectTask && onSelectTask(task)}
            style={{ cursor: onSelectTask ? 'pointer' : 'default' }}
            role={onSelectTask ? 'button' : undefined}
            tabIndex={onSelectTask ? 0 : undefined}
          >
            <div className="mini-task-info">
              <span className="mini-task-title" style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
                {task.title}
              </span>
              <span className="mini-task-meta">
                {isCompleted ? (
                  <CheckCircle2 size={12} style={{ color: '#10b981' }} />
                ) : (
                  <CircleDot size={12} style={{ color: 'var(--primary)' }} />
                )}
                <span>
                  {task.completedAt
                    ? `Completed ${formatRelativeTime(task.completedAt)}`
                    : `Updated ${formatRelativeTime(timestamp)}`}
                </span>
              </span>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                color: isCompleted ? '#10b981' : 'var(--text-secondary)',
                fontWeight: 600,
              }}
            >
              {isCompleted ? 'Done' : 'Active'}
            </span>
          </div>
        );
      })}
    </div>
  );
}
