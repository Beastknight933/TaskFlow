import React from 'react';
import { useTasks } from '../../hooks/useTasks';
import {
  LayoutDashboard,
  CheckSquare,
  Settings,
  X,
  Database,
  Check,
} from 'lucide-react';

export function Sidebar({ currentView, onSelectView, isOpen, onClose }) {
  const { tasks, stats } = useTasks();

  const handleNavClick = (view) => {
    onSelectView(view);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`} aria-label="Main Navigation">
        <div className="sidebar-header">
          <div className="app-brand">
            <div className="app-brand-icon">
              <Check size={20} strokeWidth={3} />
            </div>
            <span>TaskFlow</span>
          </div>
          <button
            type="button"
            className="menu-toggle-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="nav-item-content">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </div>
            {stats.total > 0 && <span className="nav-badge">{stats.total}</span>}
          </button>

          <button
            type="button"
            className={`nav-item ${currentView === 'tasks' ? 'active' : ''}`}
            onClick={() => handleNavClick('tasks')}
          >
            <div className="nav-item-content">
              <CheckSquare size={18} />
              <span>All Tasks</span>
            </div>
            {stats.pending > 0 && (
              <span
                className="nav-badge"
                style={{
                  backgroundColor: stats.overdue > 0 ? 'var(--status-overdue-bg)' : undefined,
                  color: stats.overdue > 0 ? 'var(--status-overdue-text)' : undefined,
                }}
              >
                {stats.pending}
              </span>
            )}
          </button>

          <button
            type="button"
            className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavClick('settings')}
          >
            <div className="nav-item-content">
              <Settings size={18} />
              <span>Settings</span>
            </div>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-storage-badge" title="Data stored in browser Local Storage">
            <span className="storage-dot" />
            <span>Local Storage Active</span>
          </div>
        </div>
      </aside>
    </>
  );
}
