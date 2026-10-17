import React from 'react';

export function Badge({ children, variant = 'pending', className = '', withDot = true }) {
  return (
    <span className={`badge badge-${variant} ${className}`.trim()}>
      {withDot && <span className="badge-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
