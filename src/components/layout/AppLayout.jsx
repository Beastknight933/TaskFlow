import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Dashboard } from '../dashboard/Dashboard';
import { TaskList } from '../tasks/TaskList';
import { SettingsView } from '../settings/SettingsView';
import { TaskFormModal } from '../dialogs/TaskFormModal';
import { DeleteConfirmDialog } from '../dialogs/DeleteConfirmDialog';
import { ClearAllDialog } from '../dialogs/ClearAllDialog';
import { ToastContainer } from '../common/Toast';
import { useTasks } from '../../hooks/useTasks';

export function AppLayout({ toasts, dismissToast }) {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    tasks,
    isCreateModalOpen,
    closeCreateModal,
    editingTask,
    closeEditModal,
    taskToDelete,
    closeDeleteDialog,
    isClearAllDialogOpen,
    closeClearAllDialog,
    createTask,
    updateTask,
    deleteTask,
    clearAllTasks,
  } = useTasks();

  const handleCreateSubmit = (taskData) => {
    return createTask(taskData);
  };

  const handleEditSubmit = (taskData) => {
    if (!editingTask) return { success: false };
    return updateTask(editingTask.id, taskData);
  };

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header
          currentView={currentView}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNavigateToTasks={() => setCurrentView('tasks')}
        />

        <main className="app-content">
          {currentView === 'dashboard' && (
            <Dashboard onNavigateToTasks={() => setCurrentView('tasks')} />
          )}
          {currentView === 'tasks' && <TaskList />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Task Creation Modal */}
      <TaskFormModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={handleCreateSubmit}
        task={null}
        existingTasks={tasks}
      />

      {/* Task Editing Modal */}
      <TaskFormModal
        isOpen={Boolean(editingTask)}
        onClose={closeEditModal}
        onSubmit={handleEditSubmit}
        task={editingTask}
        existingTasks={tasks}
      />

      {/* Task Deletion Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(taskToDelete)}
        onClose={closeDeleteDialog}
        onConfirm={deleteTask}
        task={taskToDelete}
      />

      {/* Clear All Confirmation Dialog */}
      <ClearAllDialog
        isOpen={isClearAllDialogOpen}
        onClose={closeClearAllDialog}
        onConfirm={clearAllTasks}
        taskCount={tasks.length}
      />

      {/* Accessible Floating Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
