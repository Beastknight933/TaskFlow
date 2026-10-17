import { STORAGE_KEYS, SCHEMA_VERSION, THEMES, DEFAULT_PREFERENCES } from '../utils/constants';

/**
 * Storage Service for TaskFlow
 * Provides robust, fault-tolerant persistence using browser LocalStorage.
 * Handles schema migration, corrupted data backup, quota limits, and private browsing errors.
 */

class StorageService {
  /**
   * Safe check for localStorage availability.
   * @returns {boolean}
   */
  isStorageAvailable() {
    try {
      const testKey = '__taskflow_storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Loads tasks from LocalStorage with error detection and schema migration.
   * @returns {{ tasks: Array, error: string|null, isCorrupted: boolean }}
   */
  loadTasks() {
    if (!this.isStorageAvailable()) {
      return {
        tasks: [],
        error: 'LocalStorage is unavailable or disabled in this browser mode. Changes will not persist after reload.',
        isCorrupted: false,
      };
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!raw) {
        return { tasks: [], error: null, isCorrupted: false };
      }

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (parseError) {
        // Data is malformed JSON. Create backup and do NOT silently erase!
        const backupKey = `${STORAGE_KEYS.CORRUPT_BACKUP_PREFIX}${Date.now()}`;
        try {
          window.localStorage.setItem(backupKey, raw);
        } catch {
          // Ignore secondary failure
        }
        return {
          tasks: [],
          error: `Stored task data was malformed and could not be parsed. A backup was saved to '${backupKey}'.`,
          isCorrupted: true,
        };
      }

      // Check structure and migrate if needed
      let tasksArray = [];
      if (Array.isArray(parsed)) {
        // Direct array format (version 1)
        tasksArray = parsed;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.tasks)) {
        // Wrapped format with version
        tasksArray = parsed.tasks;
      } else {
        return {
          tasks: [],
          error: 'Stored data was not in a valid task list format.',
          isCorrupted: true,
        };
      }

      // Sanitize and validate each task item
      const sanitized = tasksArray
        .filter((item) => item && typeof item === 'object' && item.title)
        .map((task) => ({
          id: task.id || `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          title: String(task.title || '').trim(),
          description: String(task.description || ''),
          priority: ['low', 'medium', 'high'].includes(task.priority) ? task.priority : 'medium',
          status: ['pending', 'completed'].includes(task.status) ? task.status : 'pending',
          createdAt: task.createdAt || new Date().toISOString(),
          updatedAt: task.updatedAt || task.createdAt || new Date().toISOString(),
          dueDate: task.dueDate || null,
          completedAt: task.completedAt || null,
          isDemo: Boolean(task.isDemo),
        }));

      return { tasks: sanitized, error: null, isCorrupted: false };
    } catch (err) {
      return {
        tasks: [],
        error: `Failed to load tasks: ${err.message || 'Unknown storage error'}`,
        isCorrupted: false,
      };
    }
  }

  /**
   * Persists tasks to LocalStorage.
   * @param {Array} tasks
   * @returns {{ success: boolean, error: string|null }}
   */
  saveTasks(tasks) {
    if (!this.isStorageAvailable()) {
      return {
        success: false,
        error: 'LocalStorage is not accessible. Tasks cannot be saved.',
      };
    }

    try {
      const payload = {
        version: SCHEMA_VERSION,
        updatedAt: new Date().toISOString(),
        tasks,
      };
      window.localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(payload));
      return { success: true, error: null };
    } catch (err) {
      if (err.name === 'QuotaExceededError' || err.code === 22) {
        return {
          success: false,
          error: 'Browser storage quota exceeded. Please remove old tasks or clear space.',
        };
      }
      return {
        success: false,
        error: `Could not save tasks: ${err.message}`,
      };
    }
  }

  /**
   * Loads saved theme preference (default: dark).
   * @returns {string}
   */
  loadTheme() {
    if (!this.isStorageAvailable()) return THEMES.DARK;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === THEMES.LIGHT || saved === THEMES.DARK) {
        return saved;
      }
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return THEMES.LIGHT;
      }
      return THEMES.DARK;
    } catch {
      return THEMES.DARK;
    }
  }

  /**
   * Persists theme preference.
   * @param {string} theme
   */
  saveTheme(theme) {
    if (!this.isStorageAvailable()) return;
    try {
      window.localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (err) {
      console.warn('Unable to persist theme:', err);
    }
  }

  /**
   * Loads user preferences (sort options, view style).
   * @returns {Object}
   */
  loadPreferences() {
    if (!this.isStorageAvailable()) return DEFAULT_PREFERENCES;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (!saved) return DEFAULT_PREFERENCES;
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_PREFERENCES, ...parsed };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  /**
   * Persists user preferences.
   * @param {Object} preferences
   */
  savePreferences(preferences) {
    if (!this.isStorageAvailable()) return;
    try {
      window.localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    } catch (err) {
      console.warn('Unable to persist preferences:', err);
    }
  }

  /**
   * Clears all tasks from storage.
   */
  clearAllTasks() {
    if (!this.isStorageAvailable()) return;
    try {
      window.localStorage.removeItem(STORAGE_KEYS.TASKS);
    } catch (err) {
      console.warn('Unable to clear tasks:', err);
    }
  }
}

export const storageService = new StorageService();
