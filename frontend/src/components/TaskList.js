import React, { useState, useEffect, useCallback } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { taskApi } from '../services/api';

/**
 * TaskList Component
 * 
 * Main container for task management.
 * Manages global state, API communication, and coordinates child components.
 * Follows Single Responsibility by acting as the state container.
 */
const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());
  const [filter, setFilter] = useState('all'); // all, active, completed

  // Fetch tasks on mount
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskApi.getAllTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Helper to track processing state
  const withProcessing = async (id, asyncFn) => {
    setProcessingIds(prev => new Set(prev).add(id));
    try {
      return await asyncFn();
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleCreate = async (taskData) => {
    try {
      const newTask = await taskApi.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      setShowForm(false);
    } catch (err) {
      setError('Failed to create task: ' + err.message);
    }
  };

  const handleUpdate = async (taskData) => {
    if (!editingTask) return;

    try {
      const updated = await taskApi.updateTask(editingTask.id, taskData);
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
      setEditingTask(null);
      setShowForm(false);
    } catch (err) {
      setError('Failed to update task: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    await withProcessing(id, async () => {
      try {
        await taskApi.deleteTask(id);
        setTasks(prev => prev.filter(t => t.id !== id));
      } catch (err) {
        setError('Failed to delete task: ' + err.message);
      }
    });
  };

  const handleToggle = async (id) => {
    await withProcessing(id, async () => {
      try {
        const updated = await taskApi.toggleComplete(id);
        setTasks(prev => prev.map(t => t.id === id ? updated : t));
      } catch (err) {
        setError('Failed to update task: ' + err.message);
      }
    });
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="task-list-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <div className="header-title">
          <h1>My Tasks</h1>
          <span className="task-count">{stats.active} active</span>
        </div>
        <button className="btn btn-primary add-btn" onClick={handleAddNew}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Task
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)} aria-label="Dismiss error">×</button>
        </div>
      )}

      <div className="filter-tabs">
        {[
          { key: 'all', label: 'All', count: stats.total },
          { key: 'active', label: 'Active', count: stats.active },
          { key: 'completed', label: 'Completed', count: stats.completed },
        ].map(tab => (
          <button
            key={tab.key}
            className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="tasks-wrapper">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            <h3>{filter === 'completed' ? 'No completed tasks yet' : 'No tasks found'}</h3>
            <p>{filter === 'completed' 
              ? 'Finish some tasks to see them here.' 
              : 'Get started by adding your first task!'}</p>
            {filter !== 'completed' && (
              <button className="btn btn-primary" onClick={handleAddNew}>
                Create Your First Task
              </button>
            )}
          </div>
        ) : (
          <div className="tasks-list">
            {filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isProcessing={processingIds.has(task.id)}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onCancel={handleCancel}
          isLoading={false}
        />
      )}
    </div>
  );
};

export default TaskList;
