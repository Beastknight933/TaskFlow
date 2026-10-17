import React from 'react';
import { PRIORITIES } from '../../utils/constants';

export function PriorityBreakdown({ priorityCounts = {}, priorityPendingCounts = {}, total = 0 }) {
  const levels = [
    { key: PRIORITIES.HIGH, label: 'High Priority', colorClass: 'high' },
    { key: PRIORITIES.MEDIUM, label: 'Medium Priority', colorClass: 'medium' },
    { key: PRIORITIES.LOW, label: 'Low Priority', colorClass: 'low' },
  ];

  return (
    <div className="priority-bars-container">
      {levels.map(({ key, label, colorClass }) => {
        const count = priorityCounts[key] || 0;
        const pendingCount = priorityPendingCounts[key] || 0;
        const percent = total > 0 ? Math.round((count / total) * 100) : 0;

        return (
          <div key={key} className="priority-bar-item">
            <div className="priority-bar-header">
              <span className="priority-bar-name">
                <span className={`badge-dot`} style={{ backgroundColor: `var(--priority-${colorClass === 'medium' ? 'med' : colorClass}-dot)` }} />
                <span>{label}</span>
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                <strong>{count}</strong> {count === 1 ? 'task' : 'tasks'} ({pendingCount} pending)
              </span>
            </div>
            <div className="priority-bar-track">
              <div
                className={`priority-bar-fill ${colorClass}`}
                style={{ width: `${percent}%` }}
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`${label} percentage: ${percent}%`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
