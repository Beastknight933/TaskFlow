import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { TaskProvider } from './context/TaskContext';
import { AppLayout } from './components/layout/AppLayout';
import { useToast } from './hooks/useToast';
import './styles/index.css';
import './styles/components.css';

function AppContent() {
  const toast = useToast();

  return (
    <TaskProvider onNotify={toast}>
      <AppLayout toasts={toast.toasts} dismissToast={toast.dismissToast} />
    </TaskProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
