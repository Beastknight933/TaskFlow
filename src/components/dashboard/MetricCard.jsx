import React from 'react';

export function MetricCard({ title, value, subtext, icon: Icon, variant = 'total', onClick }) {
  return (
    <div
      className={`metric-card metric-${variant}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="metric-content">
        <span className="metric-label">{title}</span>
        <span className="metric-value">{value}</span>
        {subtext && <span className="metric-subtext">{subtext}</span>}
      </div>
      <div className="metric-icon-wrap" aria-hidden="true">
        {Icon && <Icon size={24} />}
      </div>
    </div>
  );
}
