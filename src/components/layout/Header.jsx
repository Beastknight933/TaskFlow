import React from 'react';
import { Button } from '../common/Button';
import { useTheme } from '../../hooks/useTheme';
import { useTasks } from '../../hooks/useTasks';
import { THEMES } from '../../utils/constants';
import {
  Menu,
  Moon,
  Sun,
  PlusCircle,
  Search,
  X,
} from 'lucide-react';

export function Header({ currentView, onToggleSidebar, onNavigateToTasks }) {
  const { theme, toggleTheme } = useTheme();
  const { filters, setSearch, openCreateModal } = useTasks();

  const isDark = theme === THEMES.DARK;

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'tasks':
        return 'All Tasks';
      case 'settings':
        return 'Settings & Preferences';
      default:
        return 'TaskFlow';
    }
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    if (currentView !== 'tasks' && onNavigateToTasks) {
      onNavigateToTasks();
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>

      <div className="header-right">
        {/* Global Quick Search */}
        <div className="header-search">
          <Search className="header-search-icon" size={16} aria-hidden="true" />
          <input
            type="search"
            placeholder="Quick search..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label="Quick search tasks"
          />
          {filters.search && (
            <button
              type="button"
              className="header-search-clear"
              onClick={() => setSearch('')}
              aria-label="Clear header search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          className="btn-icon btn-secondary"
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* New Task Button */}
        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={openCreateModal}
        >
          New Task
        </Button>
      </div>
    </header>
  );
}
