import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { getSampleTasks } from '../utils/sampleData';
import { validateTask } from '../utils/validators';
import { filterTasks, sortTasks, calculateDashboardStats } from '../utils/filterSortUtils';
import {
  STATUSES,
  PRIORITIES,
  FILTER_STATUS,
  FILTER_PRIORITY,
  FILTER_DATE,
  SORT_FIELDS,
  SORT_ORDERS,
  DEFAULT_PREFERENCES,
} from '../utils/constants';

const TaskContext = createContext(null);

export function TaskProvider({ children, onNotify }) {
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageError, setStorageError] = useState(null);
  const [isCorrupted, setIsCorrupted] = useState(false);
  const [preferences, setPreferencesState] = useState(DEFAULT_PREFERENCES);

  // Filters State
  const [filters, setFiltersState] = useState({
    search: '',
    status: FILTER_STATUS.ALL,
    priority: FILTER_PRIORITY.ALL,
    date: FILTER_DATE.ALL,
  });

  // Sorting State
  const [sort, setSortState] = useState({
    field: DEFAULT_PREFERENCES.defaultSortField,
    order: DEFAULT_PREFERENCES.defaultSortOrder,
  });

  // Modals / Dialogs State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false);

  // Load initial tasks and preferences from LocalStorage
  useEffect(() => {
    const { tasks: loadedTasks, error, isCorrupted: corrupted } = storageService.loadTasks();
    const loadedPrefs = storageService.loadPreferences();

    setTasks(loadedTasks);
    setStorageError(error);
    setIsCorrupted(corrupted);
    setPreferencesState(loadedPrefs);
    setSortState({
      field: loadedPrefs.defaultSortField || SORT_FIELDS.DUE_DATE,
      order: loadedPrefs.defaultSortOrder || SORT_ORDERS.ASC,
    });
    setIsLoaded(true);

    if (error && onNotify) {
      onNotify.error(error, corrupted ? 'Corrupted Data Backup' : 'Storage Notice');
    }
  }, [onNotify]);

  // Persist tasks when state changes (only after initial load has finished)
  const persistTasks = useCallback((newTasks) => {
    setTasks(newTasks);
    const result = storageService.saveTasks(newTasks);
    if (!result.success) {
      setStorageError(result.error);
      if (onNotify) {
        onNotify.error(result.error, 'Storage Error');
      }
    } else {
      setStorageError(null);
    }
  }, [onNotify]);

  // Update preferences
  const updatePreferences = useCallback((newPrefs) => {
    setPreferencesState((prev) => {
      const merged = { ...prev, ...newPrefs };
      storageService.savePreferences(merged);
      return merged;
    });
  }, []);

  // Create Task
  const createTask = useCallback(
    (taskData) => {
      const nowIso = new Date().toISOString();
      const validation = validateTask(taskData, nowIso, tasks);

      if (!validation.isValid) {
        return { success: false, errors: validation.errors, warnings: validation.warnings };
      }

      const newTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: taskData.title.trim(),
        description: (taskData.description || '').trim(),
        priority: taskData.priority || PRIORITIES.MEDIUM,
        status: STATUSES.PENDING,
        createdAt: nowIso,
        updatedAt: nowIso,
        dueDate: taskData.dueDate || null,
        completedAt: null,
        isDemo: false,
      };

      const nextTasks = [newTask, ...tasks];
      persistTasks(nextTasks);

      if (onNotify) {
        onNotify.success(`Task "${newTask.title}" created successfully.`);
      }

      return { success: true, task: newTask, warnings: validation.warnings };
    },
    [tasks, persistTasks, onNotify]
  );

  // Edit Task
  const updateTask = useCallback(
    (id, taskData) => {
      const existing = tasks.find((t) => t.id === id);
      if (!existing) {
        return { success: false, errors: { general: 'Task not found.' } };
      }

      const validation = validateTask(taskData, existing.createdAt, tasks, id);
      if (!validation.isValid) {
        return { success: false, errors: validation.errors, warnings: validation.warnings };
      }

      const updatedTask = {
        ...existing,
        title: taskData.title.trim(),
        description: (taskData.description || '').trim(),
        priority: taskData.priority,
        dueDate: taskData.dueDate || null,
        updatedAt: new Date().toISOString(),
      };

      const nextTasks = tasks.map((t) => (t.id === id ? updatedTask : t));
      persistTasks(nextTasks);

      if (onNotify) {
        onNotify.success(`Task "${updatedTask.title}" updated.`);
      }

      return { success: true, task: updatedTask, warnings: validation.warnings };
    },
    [tasks, persistTasks, onNotify]
  );

  // Toggle Task Completion
  const toggleTaskStatus = useCallback(
    (id) => {
      const target = tasks.find((t) => t.id === id);
      if (!target) return;

      const isCompleting = target.status !== STATUSES.COMPLETED;
      const nowIso = new Date().toISOString();

      const updatedTask = {
        ...target,
        status: isCompleting ? STATUSES.COMPLETED : STATUSES.PENDING,
        completedAt: isCompleting ? nowIso : null,
        updatedAt: nowIso,
      };

      const nextTasks = tasks.map((t) => (t.id === id ? updatedTask : t));
      persistTasks(nextTasks);

      if (onNotify) {
        if (isCompleting) {
          onNotify.success(`Completed "${target.title}"!`);
        } else {
          onNotify.info(`Reopened "${target.title}".`);
        }
      }
    },
    [tasks, persistTasks, onNotify]
  );

  // Delete Task
  const deleteTask = useCallback(
    (id) => {
      const target = tasks.find((t) => t.id === id);
      const nextTasks = tasks.filter((t) => t.id !== id);
      persistTasks(nextTasks);

      if (onNotify && target) {
        onNotify.info(`Deleted task "${target.title}".`);
      }
    },
    [tasks, persistTasks, onNotify]
  );

  // Clear all tasks
  const clearAllTasks = useCallback(() => {
    storageService.clearAllTasks();
    setTasks([]);
    if (onNotify) {
      onNotify.info('All tasks have been cleared.');
    }
  }, [onNotify]);

  // Load Demo Data
  const loadDemoTasks = useCallback(() => {
    const samples = getSampleTasks();
    // Prepend sample tasks, avoiding duplicate IDs if repeated
    const currentNonDemo = tasks.filter((t) => !t.isDemo);
    const combined = [...samples, ...currentNonDemo];
    persistTasks(combined);
    if (onNotify) {
      onNotify.success('Demo tasks loaded successfully.');
    }
  }, [tasks, persistTasks, onNotify]);

  // Remove Demo Data
  const removeDemoTasks = useCallback(() => {
    const clean = tasks.filter((t) => !t.isDemo);
    persistTasks(clean);
    if (onNotify) {
      onNotify.info('Demo tasks removed.');
    }
  }, [tasks, persistTasks, onNotify]);

  // Filter setters
  const setSearch = useCallback((search) => {
    setFiltersState((prev) => ({ ...prev, search }));
  }, []);

  const setStatusFilter = useCallback((status) => {
    setFiltersState((prev) => ({ ...prev, status }));
  }, []);

  const setPriorityFilter = useCallback((priority) => {
    setFiltersState((prev) => ({ ...prev, priority }));
  }, []);

  const setDateFilter = useCallback((date) => {
    setFiltersState((prev) => ({ ...prev, date }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({
      search: '',
      status: FILTER_STATUS.ALL,
      priority: FILTER_PRIORITY.ALL,
      date: FILTER_DATE.ALL,
    });
  }, []);

  const isFiltersActive = useMemo(() => {
    return (
      Boolean(filters.search.trim()) ||
      filters.status !== FILTER_STATUS.ALL ||
      filters.priority !== FILTER_PRIORITY.ALL ||
      filters.date !== FILTER_DATE.ALL
    );
  }, [filters]);

  // Sorting setters
  const setSort = useCallback((field, order) => {
    setSortState((prev) => ({
      field: field !== undefined ? field : prev.field,
      order: order !== undefined ? order : prev.order,
    }));
  }, []);

  const toggleSortOrder = useCallback(() => {
    setSortState((prev) => ({
      ...prev,
      order: prev.order === SORT_ORDERS.ASC ? SORT_ORDERS.DESC : SORT_ORDERS.ASC,
    }));
  }, []);

  // Modal dialog handlers
  const openCreateModal = useCallback(() => setIsCreateModalOpen(true), []);
  const closeCreateModal = useCallback(() => setIsCreateModalOpen(false), []);

  const openEditModal = useCallback((task) => setEditingTask(task), []);
  const closeEditModal = useCallback(() => setEditingTask(null), []);

  const openDeleteDialog = useCallback((task) => setTaskToDelete(task), []);
  const closeDeleteDialog = useCallback(() => setTaskToDelete(null), []);

  const openClearAllDialog = useCallback(() => setIsClearAllDialogOpen(true), []);
  const closeClearAllDialog = useCallback(() => setIsClearAllDialogOpen(false), []);

  // Filtered and sorted tasks derivation
  const filteredAndSortedTasks = useMemo(() => {
    const filtered = filterTasks(tasks, filters);
    return sortTasks(filtered, sort.field, sort.order);
  }, [tasks, filters, sort]);

  // Real-time derived dashboard statistics
  const stats = useMemo(() => {
    return calculateDashboardStats(tasks);
  }, [tasks]);

  const value = {
    tasks,
    isLoaded,
    storageError,
    isCorrupted,
    preferences,
    updatePreferences,
    filters,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    setDateFilter,
    clearFilters,
    isFiltersActive,
    sort,
    setSort,
    toggleSortOrder,
    createTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
    clearAllTasks,
    loadDemoTasks,
    removeDemoTasks,
    // Modals
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    editingTask,
    openEditModal,
    closeEditModal,
    taskToDelete,
    openDeleteDialog,
    closeDeleteDialog,
    isClearAllDialogOpen,
    openClearAllDialog,
    closeClearAllDialog,
    // Computed
    filteredAndSortedTasks,
    stats,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
