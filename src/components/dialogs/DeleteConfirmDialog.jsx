import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertTriangle, Trash2 } from 'lucide-react';

export function DeleteConfirmDialog({ isOpen, onClose, onConfirm, task }) {
  if (!task) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Task"
      maxWidth="480px"
    >
      <div className="modal-body">
        <div className="confirm-dialog-content">
          <div className="confirm-icon-wrap" aria-hidden="true">
            <AlertTriangle size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>
              Are you sure you want to delete this task?
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              This operation is permanent. The task will be removed from your local storage and cannot be restored.
            </p>
          </div>
          <div className="confirm-target-title" title={task.title}>
            "{task.title}"
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          icon={Trash2}
          onClick={() => {
            onConfirm(task.id);
            onClose();
          }}
        >
          Delete Task
        </Button>
      </div>
    </Modal>
  );
}
