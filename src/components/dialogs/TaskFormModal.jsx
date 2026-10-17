import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PRIORITIES } from '../../utils/constants';
import { toDateTimeLocalInput, fromDateTimeLocalInput } from '../../utils/dateUtils';
import { validateTask } from '../../utils/validators';
import { AlertCircle, AlertTriangle, Calendar, PlusCircle, Check } from 'lucide-react';

export function TaskFormModal({ isOpen, onClose, onSubmit, task = null, existingTasks = [] }) {
  const isEditing = Boolean(task);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(PRIORITIES.MEDIUM);
  const [dueDateInput, setDueDateInput] = useState('');
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prepopulate form when opened or task changes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setPriority(task.priority || PRIORITIES.MEDIUM);
        setDueDateInput(toDateTimeLocalInput(task.dueDate));
      } else {
        // Reset defaults for creation
        setTitle('');
        setDescription('');
        setPriority(PRIORITIES.MEDIUM);
        // Default due date: tomorrow at 18:00
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(18, 0, 0, 0);
        setDueDateInput(toDateTimeLocalInput(tomorrow));
      }
      setErrors({});
      setWarnings({});
      setIsSubmitting(false);
    }
  }, [isOpen, task]);

  // Live title duplicate and length validation
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);

    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: null }));
    }

    const trimmed = val.trim();
    if (trimmed) {
      const duplicate = existingTasks.find(
        (t) =>
          t.id !== (task ? task.id : null) &&
          t.title.trim().toLowerCase() === trimmed.toLowerCase() &&
          t.status !== 'completed'
      );
      if (duplicate) {
        setWarnings((prev) => ({
          ...prev,
          title: 'A pending task with this title already exists.',
        }));
      } else {
        setWarnings((prev) => ({ ...prev, title: null }));
      }
    } else {
      setWarnings((prev) => ({ ...prev, title: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const isoDueDate = fromDateTimeLocalInput(dueDateInput);
    const payload = {
      title,
      description,
      priority,
      dueDate: isoDueDate,
    };

    const baseCreatedAt = task ? task.createdAt : new Date().toISOString();
    const validation = validateTask(payload, baseCreatedAt, existingTasks, task ? task.id : null);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setWarnings(validation.warnings);
      return;
    }

    setIsSubmitting(true);
    const result = onSubmit(payload);

    if (result && !result.success && result.errors) {
      setErrors(result.errors);
      setIsSubmitting(false);
    } else {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      maxWidth="560px"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="modal-body">
          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="task-form-title" className="form-label">
              <span>
                Task Title <span className="required-indicator">*</span>
              </span>
              <span className="form-hint">{title.length}/120</span>
            </label>
            <input
              id="task-form-title"
              type="text"
              className={`form-control ${errors.title ? 'has-error' : ''}`}
              placeholder="e.g., Conduct user research interviews"
              value={title}
              onChange={handleTitleChange}
              maxLength={120}
              required
              autoFocus
            />
            {errors.title && (
              <div className="form-error-msg" role="alert">
                <AlertCircle size={14} />
                <span>{errors.title}</span>
              </div>
            )}
            {warnings.title && !errors.title && (
              <div className="form-warning-msg">
                <AlertTriangle size={14} />
                <span>{warnings.title}</span>
              </div>
            )}
          </div>

          {/* Priority Field */}
          <div className="form-group">
            <span className="form-label">Priority Level</span>
            <div className="priority-radio-grid" role="radiogroup" aria-label="Task Priority">
              {Object.values(PRIORITIES).map((p) => {
                const isSelected = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setPriority(p)}
                    className={`priority-radio-option priority-${p} ${isSelected ? 'selected' : ''}`}
                  >
                    <span className={`badge-dot`} />
                    <span style={{ textTransform: 'capitalize' }}>{p}</span>
                    {isSelected && <Check size={14} aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
            {errors.priority && (
              <div className="form-error-msg" role="alert">
                <AlertCircle size={14} />
                <span>{errors.priority}</span>
              </div>
            )}
          </div>

          {/* Due Date Field */}
          <div className="form-group">
            <label htmlFor="task-form-duedate" className="form-label">
              <span>Due Date & Time</span>
              {dueDateInput && (
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ fontSize: '0.75rem', padding: '0 4px', textDecoration: 'underline' }}
                  onClick={() => setDueDateInput('')}
                >
                  Clear deadline
                </button>
              )}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="task-form-duedate"
                type="datetime-local"
                className={`form-control ${errors.dueDate ? 'has-error' : ''}`}
                value={dueDateInput}
                onChange={(e) => {
                  setDueDateInput(e.target.value);
                  if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: null }));
                }}
              />
            </div>
            {errors.dueDate && (
              <div className="form-error-msg" role="alert">
                <AlertCircle size={14} />
                <span>{errors.dueDate}</span>
              </div>
            )}
            <span className="form-hint">
              Tasks without a deadline will not trigger overdue alerts.
            </span>
          </div>

          {/* Description Field */}
          <div className="form-group">
            <label htmlFor="task-form-description" className="form-label">
              <span>Description / Notes</span>
              <span className="form-hint">{description.length}/1000</span>
            </label>
            <textarea
              id="task-form-description"
              className={`form-control ${errors.description ? 'has-error' : ''}`}
              rows={4}
              placeholder="Add key context, checklists, or reference links..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
            />
            {errors.description && (
              <div className="form-error-msg" role="alert">
                <AlertCircle size={14} />
                <span>{errors.description}</span>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={isEditing ? Check : PlusCircle}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
