import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useTheme } from '../../hooks/useTheme';
import { useTasks } from '../../hooks/useTasks';
import { THEMES, SORT_FIELDS, SORT_ORDERS } from '../../utils/constants';
import {
  Moon,
  Sun,
  Trash2,
  Sparkles,
  Database,
  ArrowUpDown,
  ShieldAlert,
  Info,
} from 'lucide-react';

export function SettingsView() {
  const { theme, toggleTheme } = useTheme();
  const {
    tasks,
    preferences,
    updatePreferences,
    openClearAllDialog,
    loadDemoTasks,
    removeDemoTasks,
    storageError,
    isCorrupted,
  } = useTasks();

  const isDark = theme === THEMES.DARK;
  const demoTaskCount = tasks.filter((t) => t.isDemo).length;

  return (
    <div className="settings-section">
      {/* Theme Card */}
      <Card className="settings-card">
        <h3 className="dashboard-card-title">
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
          <span>Interface Appearance</span>
        </h3>
        <div className="settings-row">
          <div className="settings-info">
            <span className="settings-title">Color Theme</span>
            <span className="settings-description">
              Choose between dark mode (recommended for low light) and light mode.
            </span>
          </div>
          <Button
            variant="secondary"
            icon={isDark ? Sun : Moon}
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
          >
            {isDark ? 'Switch to Light' : 'Switch to Dark'}
          </Button>
        </div>
      </Card>

      {/* Task Sorting Defaults Card */}
      <Card className="settings-card">
        <h3 className="dashboard-card-title">
          <ArrowUpDown size={18} />
          <span>Task Preferences</span>
        </h3>
        <div className="settings-row">
          <div className="settings-info">
            <span className="settings-title">Default Task Sort Field</span>
            <span className="settings-description">
              The default sorting field applied when loading the task list.
            </span>
          </div>
          <select
            className="filter-select"
            value={preferences.defaultSortField}
            onChange={(e) => updatePreferences({ defaultSortField: e.target.value })}
            aria-label="Default sort field"
          >
            <option value={SORT_FIELDS.DUE_DATE}>Due Date</option>
            <option value={SORT_FIELDS.PRIORITY}>Priority</option>
            <option value={SORT_FIELDS.CREATED_AT}>Creation Date</option>
            <option value={SORT_FIELDS.TITLE}>Title</option>
          </select>
        </div>

        <div className="settings-row">
          <div className="settings-info">
            <span className="settings-title">Default Sort Direction</span>
            <span className="settings-description">
              Default ordering direction for task lists.
            </span>
          </div>
          <select
            className="filter-select"
            value={preferences.defaultSortOrder}
            onChange={(e) => updatePreferences({ defaultSortOrder: e.target.value })}
            aria-label="Default sort direction"
          >
            <option value={SORT_ORDERS.ASC}>Ascending</option>
            <option value={SORT_ORDERS.DESC}>Descending</option>
          </select>
        </div>
      </Card>

      {/* Demo Data Management */}
      <Card className="settings-card">
        <h3 className="dashboard-card-title">
          <Sparkles size={18} />
          <span>Demo Data Controls</span>
        </h3>
        <div className="settings-row">
          <div className="settings-info">
            <span className="settings-title">Sample Tasks</span>
            <span className="settings-description">
              Load realistic sample tasks to test sorting, filters, overdue states, and dashboard graphs.
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {demoTaskCount > 0 && (
              <Button variant="secondary" onClick={removeDemoTasks}>
                Remove Sample Tasks ({demoTaskCount})
              </Button>
            )}
            <Button variant="primary" icon={Sparkles} onClick={loadDemoTasks}>
              Load Sample Tasks
            </Button>
          </div>
        </div>
      </Card>

      {/* Local Storage Information & Diagnostics */}
      <Card className="settings-card">
        <h3 className="dashboard-card-title">
          <Database size={18} />
          <span>Storage & Persistence</span>
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-3)',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="storage-dot" style={{ width: '10px', height: '10px' }} />
            <div style={{ fontSize: '0.8125rem' }}>
              <strong>Browser Local Storage:</strong> Active & Connected (Schema v1)
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            <Info size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--primary)' }} />
            <span>
              <strong>Note on Local Storage:</strong> TaskFlow stores all tasks and preferences directly in your browser's Local Storage. Data persists across browser refreshes and tab closures, but is isolated to this specific browser and device.
            </span>
          </div>

          {storageError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: 'var(--space-3)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
              }}
            >
              <ShieldAlert size={16} />
              <span>{storageError}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Danger Zone: Clear All Tasks */}
      <Card className="settings-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
        <h3 className="dashboard-card-title" style={{ color: '#ef4444' }}>
          <Trash2 size={18} />
          <span>Danger Zone</span>
        </h3>
        <div className="settings-row">
          <div className="settings-info">
            <span className="settings-title" style={{ color: '#ef4444' }}>
              Wipe All Tasks
            </span>
            <span className="settings-description">
              Permanently erase all {tasks.length} saved {tasks.length === 1 ? 'task' : 'tasks'} from browser Local Storage.
            </span>
          </div>
          <Button
            variant="danger"
            icon={Trash2}
            disabled={tasks.length === 0}
            onClick={openClearAllDialog}
          >
            Clear All Tasks
          </Button>
        </div>
      </Card>
    </div>
  );
}
