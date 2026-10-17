import React from 'react';
import { formatRelativeTime, formatDate } from '../../utils/dateUtils';
import { Badge } from '../common/Badge';
import { Calendar, CheckCircle2 } from 'lucide-react';

export function UpcomingDeadlines({ tasks = [], onSelectTask }) {
  if (tasks.length === 0) {
    return (
      <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-muted)' }}>
        <CheckCircle2 size={32} style={{ margin: '0 auto 8px', color: '#10b981' }} />
        <p style={{ fontSize: '0.875rem' }}>No upcoming deadlines in the immediate queue. Great job staying ahead!</p>
      </div>
    );
  }

  return (
    <div className="mini-task-list">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="mini-task-item"
          onClick={() => onSelectTask && onSelectTask(task)}
          style={{ cursor: onSelectTask ? 'pointer' : 'default' }}
          role={onSelectTask ? 'button' : undefined}
          tabIndex={onSelectTask ? 0 : undefined}
        >
          <div className="mini-task-info">
            <span className="mini-task-title">{task.title}</span>
            <span className="mini-task-meta">
              <Calendar size={12} />
              <span title={formatDate(task.dueDate, true)}>
                Due {formatRelativeTime(task.dueDate)}
              </span>
            </span>
          </div>
          <Badge variant={task.priority} withDot={false}>
            {task.priority}
          </Badge>
        </div>
      ))}
    </div>
  );
}
