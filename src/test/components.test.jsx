import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';
import { STORAGE_KEYS } from '../utils/constants';

describe('TaskFlow Application Component Integration Tests', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders application with initial dashboard empty state', () => {
    render(<App />);

    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    expect(screen.getByText('Welcome to TaskFlow')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create first task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /load demo tasks/i })).toBeInTheDocument();
  });

  it('creates a new task through the modal form', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click "New Task" button in header
    const newTaskBtn = screen.getByRole('button', { name: /new task/i });
    await user.click(newTaskBtn);

    // Modal should be open
    const dialog = screen.getByRole('dialog', { name: /create new task/i });
    expect(dialog).toBeInTheDocument();

    // Fill Title
    const titleInput = within(dialog).getByRole('textbox', { name: /task title/i });
    await user.type(titleInput, 'Deploy Microservices to Cluster');

    // Select Priority: High
    const highPriorityRadio = within(dialog).getByRole('radio', { name: /high/i });
    await user.click(highPriorityRadio);

    // Fill Description
    const descInput = within(dialog).getByRole('textbox', { name: /description/i });
    await user.type(descInput, 'Ensure zero downtime during rolling updates.');

    // Submit Form
    const submitBtn = within(dialog).getByRole('button', { name: /create task/i });
    await user.click(submitBtn);

    // Modal should close
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Check dashboard metrics updated
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    const createdElements = screen.getAllByText('Deploy Microservices to Cluster');
    expect(createdElements.length).toBeGreaterThanOrEqual(1);

    // Verify persisted in LocalStorage
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.TASKS));
    expect(stored.tasks).toHaveLength(1);
    expect(stored.tasks[0].title).toBe('Deploy Microservices to Cluster');
    expect(stored.tasks[0].priority).toBe('high');
    expect(stored.tasks[0].status).toBe('pending');
  });

  it('toggles task completion status and updates metrics', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Create a task first
    await user.click(screen.getByRole('button', { name: /new task/i }));
    const dialog = screen.getByRole('dialog', { name: /create new task/i });
    await user.type(within(dialog).getByRole('textbox', { name: /task title/i }), 'Verify API Contracts');
    await user.click(within(dialog).getByRole('button', { name: /create task/i }));

    // Navigate to "All Tasks"
    const allTasksNav = screen.getByRole('button', { name: /all tasks/i });
    await user.click(allTasksNav);

    expect(screen.getByRole('heading', { name: 'All Tasks' })).toBeInTheDocument();

    // Find the task checkbox
    const checkbox = screen.getByRole('checkbox', { name: /mark "verify api contracts" as completed/i });
    expect(checkbox).not.toHaveClass('checked');

    // Click checkbox to complete
    await user.click(checkbox);
    expect(checkbox).toHaveClass('checked');

    // Verify task is marked completed in storage
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.TASKS));
    expect(stored.tasks[0].status).toBe('completed');
    expect(stored.tasks[0].completedAt).toBeTruthy();

    // Reopen task
    await user.click(checkbox);
    expect(checkbox).not.toHaveClass('checked');
    const storedReopened = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.TASKS));
    expect(storedReopened.tasks[0].status).toBe('pending');
    expect(storedReopened.tasks[0].completedAt).toBeNull();
  });

  it('edits a task and preserves original createdAt timestamp', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Create task
    await user.click(screen.getByRole('button', { name: /new task/i }));
    const createDialog = screen.getByRole('dialog', { name: /create new task/i });
    await user.type(within(createDialog).getByRole('textbox', { name: /task title/i }), 'Original Task Title');
    await user.click(within(createDialog).getByRole('button', { name: /create task/i }));

    // Wait for create dialog to close
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Navigate to tasks
    await user.click(screen.getByRole('button', { name: /all tasks/i }));

    // Click Edit button
    const editBtn = screen.getByRole('button', { name: /edit task "original task title"/i });
    await user.click(editBtn);

    // Dialog should open in edit mode
    const editDialog = screen.getByRole('dialog', { name: /edit task/i });
    expect(editDialog).toBeInTheDocument();

    const titleInput = within(editDialog).getByRole('textbox', { name: /task title/i });
    expect(titleInput).toHaveValue('Original Task Title');

    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Task Title');

    await user.click(within(editDialog).getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Updated Task Title')).toBeInTheDocument();

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.TASKS));
    expect(stored.tasks[0].title).toBe('Updated Task Title');
    expect(stored.tasks[0].createdAt).toBeTruthy();
  });

  it('prompts confirmation on task deletion and cancels without deleting', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Create task
    await user.click(screen.getByRole('button', { name: /new task/i }));
    const createDialog = screen.getByRole('dialog', { name: /create new task/i });
    await user.type(within(createDialog).getByRole('textbox', { name: /task title/i }), 'Task to Keep');
    await user.click(within(createDialog).getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /all tasks/i }));

    // Click Delete button
    const deleteBtn = screen.getByRole('button', { name: /delete task "task to keep"/i });
    await user.click(deleteBtn);

    // Confirmation dialog should be displayed identifying task
    const dialog = screen.getByRole('dialog', { name: /delete task/i });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('"Task to Keep"')).toBeInTheDocument();

    // Click Cancel
    const cancelBtn = within(dialog).getByRole('button', { name: /cancel/i });
    await user.click(cancelBtn);

    // Dialog closes and task is still present
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Task to Keep')).toBeInTheDocument();
  });

  it('permanently deletes task when confirmed', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Create task
    await user.click(screen.getByRole('button', { name: /new task/i }));
    const createDialog = screen.getByRole('dialog', { name: /create new task/i });
    await user.type(within(createDialog).getByRole('textbox', { name: /task title/i }), 'Task to Remove');
    await user.click(within(createDialog).getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /all tasks/i }));

    // Click Delete
    await user.click(screen.getByRole('button', { name: /delete task "task to remove"/i }));

    // Confirm deletion
    const dialog = screen.getByRole('dialog', { name: /delete task/i });
    const confirmDeleteBtn = within(dialog).getByRole('button', { name: /delete task/i });
    await user.click(confirmDeleteBtn);

    await waitFor(() => {
      expect(screen.queryByText('Task to Remove')).not.toBeInTheDocument();
    });

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.TASKS));
    expect(stored.tasks).toHaveLength(0);
  });

  it('filters and searches tasks correctly in task list view', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Load demo data
    const loadDemoBtn = screen.getByRole('button', { name: /load demo tasks/i });
    await user.click(loadDemoBtn);

    // Navigate to All Tasks
    await user.click(screen.getByRole('button', { name: /all tasks/i }));

    // Search for "Theme"
    const searchInput = screen.getByPlaceholderText(/search tasks by title or description/i);
    await user.type(searchInput, 'Theme');

    // Should match "Implement Dark & Light Theme Tokens"
    expect(screen.getByText('Implement Dark & Light Theme Tokens')).toBeInTheDocument();
    expect(screen.queryByText('Review System Architecture Document')).not.toBeInTheDocument();

    // Clear search using toolbar clear button
    const clearSearchBtn = screen.getByRole('button', { name: /clear task search/i });
    await user.click(clearSearchBtn);

    expect(screen.getByText('Review System Architecture Document')).toBeInTheDocument();
  });

  it('toggles light and dark theme from header', async () => {
    const user = userEvent.setup();
    render(<App />);

    const themeToggleBtn = screen.getByRole('button', { name: /switch to light mode/i });
    await user.click(themeToggleBtn);

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    const themeToggleToDark = screen.getByRole('button', { name: /switch to dark mode/i });
    await user.click(themeToggleToDark);

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
