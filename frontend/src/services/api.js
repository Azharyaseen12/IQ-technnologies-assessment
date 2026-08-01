/**
 * API Service Layer
 * 
 * Centralizes all HTTP communication with the backend.
 * Follows Single Responsibility Principle by isolating
 * network concerns from UI components.
 */

import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for logging/debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail 
      || error.response?.data?.message 
      || error.message 
      || 'An unexpected error occurred';

    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

/**
 * Task API Service
 * 
 * Encapsulates all task-related API operations.
 */
export const taskApi = {
  /**
   * Fetch all tasks
   * @returns {Promise<Array>} List of tasks
   */
  getAllTasks: async () => {
    const response = await apiClient.get('/tasks/');
    return response.data.results || response.data;
  },

  /**
   * Fetch a single task by ID
   * @param {number} id - Task ID
   * @returns {Promise<Object>} Task details
   */
  getTask: async (id) => {
    const response = await apiClient.get(`/tasks/${id}/`);
    return response.data;
  },

  /**
   * Create a new task
   * @param {Object} taskData - Task data {title, description, priority}
   * @returns {Promise<Object>} Created task
   */
  createTask: async (taskData) => {
    const response = await apiClient.post('/tasks/create/', taskData);
    return response.data;
  },

  /**
   * Update an existing task
   * @param {number} id - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise<Object>} Updated task
   */
  updateTask: async (id, taskData) => {
    const response = await apiClient.patch(`/tasks/${id}/update/`, taskData);
    return response.data;
  },

  /**
   * Delete a task
   * @param {number} id - Task ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteTask: async (id) => {
    const response = await apiClient.delete(`/tasks/${id}/delete/`);
    return response.data;
  },

  /**
   * Toggle task completion status
   * @param {number} id - Task ID
   * @returns {Promise<Object>} Updated task
   */
  toggleComplete: async (id) => {
    const response = await apiClient.patch(`/tasks/${id}/toggle/`);
    return response.data;
  },
};

export default apiClient;
