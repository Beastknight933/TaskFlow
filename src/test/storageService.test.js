import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storageService } from '../services/storageService';
import { STORAGE_KEYS, THEMES, PRIORITIES, STATUSES } from '../utils/constants';

describe('storageService', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('saves and loads tasks correctly', () => {
    const mockTasks = [
      {
        id: 'task-100',
        title: 'Complete Project Report',
        description: 'Detail all project modules',
        priority: PRIORITIES.HIGH,
        status: STATUSES.PENDING,
        createdAt: '2026-10-17T10:00:00.000Z',
        dueDate: '2026-10-20T10:00:00.000Z',
      },
    ];

    const saveRes = storageService.saveTasks(mockTasks);
    expect(saveRes.success).toBe(true);

    const loadRes = storageService.loadTasks();
    expect(loadRes.error).toBeNull();
    expect(loadRes.isCorrupted).toBe(false);
    expect(loadRes.tasks).toHaveLength(1);
    expect(loadRes.tasks[0].title).toBe('Complete Project Report');
  });

  it('recovers safely from malformed JSON and creates backup without silent data loss', () => {
    const badJson = '{"invalid_json: true, [unclosed';
    window.localStorage.setItem(STORAGE_KEYS.TASKS, badJson);

    const loadRes = storageService.loadTasks();
    expect(loadRes.isCorrupted).toBe(true);
    expect(loadRes.tasks).toEqual([]);
    expect(loadRes.error).toContain('malformed');

    // Check that backup key was generated in localStorage
    const keys = Object.keys(window.localStorage);
    const backupKey = keys.find((k) => k.startsWith(STORAGE_KEYS.CORRUPT_BACKUP_PREFIX));
    expect(backupKey).toBeTruthy();
    expect(window.localStorage.getItem(backupKey)).toBe(badJson);
  });

  it('handles invalid root structure (not an array or tasks object)', () => {
    window.localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify('some random string'));
    const loadRes = storageService.loadTasks();
    expect(loadRes.isCorrupted).toBe(true);
  });

  it('persists and loads theme preferences', () => {
    expect(storageService.loadTheme()).toBe(THEMES.DARK); // default

    storageService.saveTheme(THEMES.LIGHT);
    expect(storageService.loadTheme()).toBe(THEMES.LIGHT);

    storageService.saveTheme(THEMES.DARK);
    expect(storageService.loadTheme()).toBe(THEMES.DARK);
  });

  it('clears all tasks on clearAllTasks()', () => {
    storageService.saveTasks([{ id: '1', title: 'Task' }]);
    expect(storageService.loadTasks().tasks).toHaveLength(1);

    storageService.clearAllTasks();
    expect(storageService.loadTasks().tasks).toHaveLength(0);
  });
});
