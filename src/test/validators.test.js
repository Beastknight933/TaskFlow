import { describe, it, expect } from 'vitest';
import { validateTask } from '../utils/validators';
import { PRIORITIES } from '../utils/constants';

describe('validateTask', () => {
  it('should validate a correct task payload', () => {
    const payload = {
      title: 'Valid Task Title',
      description: 'Some description',
      priority: PRIORITIES.HIGH,
      dueDate: new Date(Date.now() + 86400000).toISOString(),
    };
    const res = validateTask(payload);
    expect(res.isValid).toBe(true);
    expect(Object.keys(res.errors).length).toBe(0);
  });

  it('should reject empty or whitespace-only title', () => {
    const resEmpty = validateTask({ title: '', priority: PRIORITIES.LOW });
    expect(resEmpty.isValid).toBe(false);
    expect(resEmpty.errors.title).toBeDefined();

    const resWhitespace = validateTask({ title: '    ', priority: PRIORITIES.LOW });
    expect(resWhitespace.isValid).toBe(false);
    expect(resWhitespace.errors.title).toBeDefined();
  });

  it('should reject title exceeding 120 characters', () => {
    const longTitle = 'a'.repeat(121);
    const res = validateTask({ title: longTitle, priority: PRIORITIES.MEDIUM });
    expect(res.isValid).toBe(false);
    expect(res.errors.title).toContain('must not exceed 120 characters');
  });

  it('should reject invalid priority values', () => {
    const res = validateTask({ title: 'Task', priority: 'ultra-urgent' });
    expect(res.isValid).toBe(false);
    expect(res.errors.priority).toBeDefined();
  });

  it('should reject due date before creation date', () => {
    const createdAt = new Date().toISOString();
    const pastDueDate = new Date(Date.now() - 3600000).toISOString(); // 1 hour ago
    const res = validateTask(
      { title: 'Task', priority: PRIORITIES.MEDIUM, dueDate: pastDueDate },
      createdAt
    );
    expect(res.isValid).toBe(false);
    expect(res.errors.dueDate).toContain('cannot be set before the creation date');
  });

  it('should warn on duplicate active task title', () => {
    const existing = [
      { id: '1', title: 'Prepare Tax Filing', status: 'pending' },
      { id: '2', title: 'Done Task', status: 'completed' },
    ];

    const res = validateTask(
      { title: 'prepare tax filing', priority: PRIORITIES.HIGH },
      new Date().toISOString(),
      existing
    );
    expect(res.isValid).toBe(true);
    expect(res.warnings.title).toContain('already exists');
  });
});
