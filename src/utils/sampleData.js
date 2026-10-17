import { PRIORITIES, STATUSES } from './constants';

/**
 * Generates sample demo tasks dynamically relative to current time.
 * @returns {Array}
 */
export function getSampleTasks() {
  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;
  const ONE_DAY = 24 * ONE_HOUR;

  return [
    {
      id: 'demo-task-1',
      title: 'Review System Architecture Document',
      description: 'Perform a comprehensive security and scalability audit on the service boundary definitions and API contracts.',
      priority: PRIORITIES.HIGH,
      status: STATUSES.PENDING,
      createdAt: new Date(now - 3 * ONE_DAY).toISOString(),
      updatedAt: new Date(now - 2 * ONE_DAY).toISOString(),
      dueDate: new Date(now - 1 * ONE_DAY).toISOString(), // Overdue
      completedAt: null,
      isDemo: true,
    },
    {
      id: 'demo-task-2',
      title: 'Implement Dark & Light Theme Tokens',
      description: 'Refactor root CSS custom properties to ensure WCAG AA contrast ratios across all interactive elements.',
      priority: PRIORITIES.HIGH,
      status: STATUSES.COMPLETED,
      createdAt: new Date(now - 4 * ONE_DAY).toISOString(),
      updatedAt: new Date(now - 1 * ONE_DAY).toISOString(),
      dueDate: new Date(now - 2 * ONE_DAY).toISOString(),
      completedAt: new Date(now - 1 * ONE_DAY).toISOString(),
      isDemo: true,
    },
    {
      id: 'demo-task-3',
      title: 'Prepare Sprint Retrospective Presentation',
      description: 'Aggregate team velocity metrics, sprint blockers, and proposed action items for Q4 planning.',
      priority: PRIORITIES.MEDIUM,
      status: STATUSES.PENDING,
      createdAt: new Date(now - 1 * ONE_DAY).toISOString(),
      updatedAt: new Date(now - 1 * ONE_DAY).toISOString(),
      dueDate: new Date(now + 4 * ONE_HOUR).toISOString(), // Due today
      completedAt: null,
      isDemo: true,
    },
    {
      id: 'demo-task-4',
      title: 'Write Unit Tests for LocalStorage Service',
      description: 'Ensure 100% coverage on schema versioning, JSON parsing fault tolerance, and quota recovery.',
      priority: PRIORITIES.HIGH,
      status: STATUSES.PENDING,
      createdAt: new Date(now - 12 * ONE_HOUR).toISOString(),
      updatedAt: new Date(now - 12 * ONE_HOUR).toISOString(),
      dueDate: new Date(now + 2 * ONE_DAY).toISOString(), // Due this week
      completedAt: null,
      isDemo: true,
    },
    {
      id: 'demo-task-5',
      title: 'Update Open Source Contribution Guidelines',
      description: 'Document local environment setup, testing conventions, and branch naming standards in CONTRIBUTING.md.',
      priority: PRIORITIES.LOW,
      status: STATUSES.PENDING,
      createdAt: new Date(now - 6 * ONE_HOUR).toISOString(),
      updatedAt: new Date(now - 6 * ONE_HOUR).toISOString(),
      dueDate: new Date(now + 5 * ONE_DAY).toISOString(), // Due this week
      completedAt: null,
      isDemo: true,
    },
    {
      id: 'demo-task-6',
      title: 'Explore Web Workers for Background Sync',
      description: 'Research browser background sync capabilities and offline caching strategies for mobile PWA.',
      priority: PRIORITIES.LOW,
      status: STATUSES.PENDING,
      createdAt: new Date(now - 2 * ONE_HOUR).toISOString(),
      updatedAt: new Date(now - 2 * ONE_HOUR).toISOString(),
      dueDate: null, // No due date
      completedAt: null,
      isDemo: true,
    },
  ];
}
