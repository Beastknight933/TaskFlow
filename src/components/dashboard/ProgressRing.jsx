import React from 'react';

export function ProgressRing({ percentage = 0, completed = 0, pending = 0, total = 0 }) {
  const radius = 48;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-widget">
      <div className="progress-ring-container">
        <svg
          className="progress-ring-svg"
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          aria-hidden="true"
        >
          <circle
            className="progress-ring-bg"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            className="progress-ring-fill"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="progress-ring-text">
          <div className="progress-ring-percent">{percentage}%</div>
          <div className="progress-ring-caption">Done</div>
        </div>
      </div>

      <div className="progress-legend">
        <div className="legend-item">
          <div className="legend-label">
            <span className="legend-color-dot" style={{ backgroundColor: 'var(--primary)' }} />
            <span>Completed Tasks</span>
          </div>
          <span className="legend-value">{completed}</span>
        </div>

        <div className="legend-item">
          <div className="legend-label">
            <span
              className="legend-color-dot"
              style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)' }}
            />
            <span>Remaining Tasks</span>
          </div>
          <span className="legend-value">{pending}</span>
        </div>

        <div className="legend-item">
          <div className="legend-label">
            <span className="legend-color-dot" style={{ backgroundColor: 'var(--text-muted)' }} />
            <span>Total Logged</span>
          </div>
          <span className="legend-value">{total}</span>
        </div>
      </div>
    </div>
  );
}
