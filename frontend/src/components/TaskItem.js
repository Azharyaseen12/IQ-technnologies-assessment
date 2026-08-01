import React from 'react';

/**
 * TaskItem Component
 * 
 * Renders a single task with action buttons.
 * Follows Single Responsibility by handling only one task's display.
 * 
 * @param {Object} props
 * @param {Object} props.task - Task data object
 * @param {Function} props.onToggle - Toggle completion callback
 * @param {Function} props.onEdit - Edit callback
 * @param {Function} props.onDelete - Delete callback
 * @param {boolean} props.isProcessing - Whether an action is in progress
 */
const TaskItem = ({ task, onToggle, onEdit, onDelete, isProcessing }) => {
  const priorityConfig = {
    1: { label: 'High', className: 'priority-high' },
    2: { label: 'Medium', className: 'priority-medium' },
    3: { label: 'Low', className: 'priority-low' },
  };

  const priority = priorityConfig[task.priority] || priorityConfig[2];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <button
          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={() => onToggle(task.id)}
          disabled={isProcessing}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>

        <div className="task-details">
          <h3 className="task-title">{task.title}</h3>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          <div className="task-meta">
            <span className={`priority-badge ${priority.className}`}>
              {priority.label}
            </span>
            <span className="task-date">
              {formatDate(task.created_at)}
            </span>
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button
          className="action-btn edit-btn"
          onClick={() => onEdit(task)}
          disabled={isProcessing}
          aria-label="Edit task"
          title="Edit"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          className="action-btn delete-btn"
          onClick={() => onDelete(task.id)}
          disabled={isProcessing}
          aria-label="Delete task"
          title="Delete"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
