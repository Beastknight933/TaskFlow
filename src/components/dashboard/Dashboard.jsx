import React from 'react';
import { MetricCard } from './MetricCard';
import { ProgressRing } from './ProgressRing';
import { PriorityBreakdown } from './PriorityBreakdown';
import { UpcomingDeadlines } from './UpcomingDeadlines';
import { RecentActivity } from './RecentActivity';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { useTasks } from '../../hooks/useTasks';
import { FILTER_STATUS, FILTER_DATE } from '../../utils/constants';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Calendar,
  History,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

export function Dashboard({ onNavigateToTasks }) {
  const {
    tasks,
    stats,
    setStatusFilter,
    setDateFilter,
    openCreateModal,
    openEditModal,
    loadDemoTasks,
  } = useTasks();

  const handleMetricClick = (filterType, filterValue) => {
    if (filterType === 'status') {
      setStatusFilter(filterValue);
    } else if (filterType === 'date') {
      setDateFilter(filterValue);
    }
    if (onNavigateToTasks) {
      onNavigateToTasks();
    }
  };

  const handleSelectTask = (task) => {
    openEditModal(task);
  };

  if (stats.total === 0) {
    return (
      <div className="dashboard-grid">
        <EmptyState
          icon={ListTodo}
          title="Welcome to TaskFlow"
          description="Your modern productivity dashboard is ready. Add your first task to start tracking metrics, priorities, and deadlines, or load sample data to explore."
          actionLabel="Create First Task"
          actionIcon={PlusCircle}
          onAction={openCreateModal}
        />
        <div style={{ textAlign: 'center', marginTop: 'var(--space-2)' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadDemoTasks}
          >
            <Sparkles size={16} />
            <span>Load Demo Tasks</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      {/* Metrics Row */}
      <div className="metrics-row">
        <MetricCard
          title="Total Tasks"
          value={stats.total}
          subtext="Across all priorities"
          icon={ListTodo}
          variant="total"
          onClick={() => handleMetricClick('status', FILTER_STATUS.ALL)}
        />
        <MetricCard
          title="Pending"
          value={stats.pending}
          subtext="Awaiting completion"
          icon={Clock}
          variant="pending"
          onClick={() => handleMetricClick('status', FILTER_STATUS.PENDING)}
        />
        <MetricCard
          title="Completed"
          value={stats.completed}
          subtext={`${stats.completionPercentage}% completion rate`}
          icon={CheckCircle2}
          variant="completed"
          onClick={() => handleMetricClick('status', FILTER_STATUS.COMPLETED)}
        />
        <MetricCard
          title="Overdue"
          value={stats.overdue}
          subtext={stats.overdue > 0 ? 'Requires attention' : 'All deadlines met'}
          icon={AlertTriangle}
          variant="overdue"
          onClick={() => handleMetricClick('date', FILTER_DATE.OVERDUE)}
        />
      </div>

      {/* Progress & Priority Analytics */}
      <div className="dashboard-columns">
        <Card>
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">
              <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
              <span>Completion Overview</span>
            </h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Real-time velocity
            </span>
          </div>
          <ProgressRing
            percentage={stats.completionPercentage}
            completed={stats.completed}
            pending={stats.pending}
            total={stats.total}
          />
        </Card>

        <Card>
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">
              <BarChart3 size={18} style={{ color: '#f59e0b' }} />
              <span>Priority Distribution</span>
            </h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Workload weighting
            </span>
          </div>
          <PriorityBreakdown
            priorityCounts={stats.priorityCounts}
            priorityPendingCounts={stats.priorityPendingCounts}
            total={stats.total}
          />
        </Card>
      </div>

      {/* Deadlines & Recent Activity */}
      <div className="dashboard-columns">
        <Card>
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">
              <Calendar size={18} style={{ color: '#6366f1' }} />
              <span>Upcoming Deadlines</span>
            </h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Chronological queue
            </span>
          </div>
          <UpcomingDeadlines
            tasks={stats.upcomingDeadlines}
            onSelectTask={handleSelectTask}
          />
        </Card>

        <Card>
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">
              <History size={18} style={{ color: '#10b981' }} />
              <span>Recently Updated</span>
            </h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Latest activity
            </span>
          </div>
          <RecentActivity
            tasks={stats.recentTasks}
            onSelectTask={handleSelectTask}
          />
        </Card>
      </div>
    </div>
  );
}
