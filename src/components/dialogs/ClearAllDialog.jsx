import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertOctagon, Trash2 } from 'lucide-react';

export function ClearAllDialog({ isOpen, onClose, onConfirm, taskCount }) {
  const [confirmationInput, setConfirmationInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setConfirmationInput('');
    }
  }, [isOpen]);

  const isConfirmed = confirmationInput.trim().toUpperCase() === 'CLEAR';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Clear All Tasks"
      maxWidth="480px"
    >
      <div className="modal-body">
        <div className="confirm-dialog-content">
          <div className="confirm-icon-wrap" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}>
            <AlertOctagon size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>
              Permanently delete all {taskCount} {taskCount === 1 ? 'task' : 'tasks'}?
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              This action will permanently wipe your saved tasks from browser local storage. This action cannot be reversed.
            </p>
          </div>

          <div style={{ width: '100%', marginTop: '8px', textAlign: 'left' }}>
            <label
              htmlFor="clear-confirm-input"
              style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}
            >
              To confirm, type <span style={{ color: '#ef4444' }}>CLEAR</span> below:
            </label>
            <input
              id="clear-confirm-input"
              type="text"
              className="form-control"
              placeholder="CLEAR"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              autoFocus
            />
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
          disabled={!isConfirmed}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Wipe All Tasks
        </Button>
      </div>
    </Modal>
  );
}
