import React, { useState } from 'react';
import TaskList from './components/TaskList';
import ApiIntegration from './components/ApiIntegration';
import './App.css';

/**
 * App Component
 *
 * Root component of the application.
 * Provides the main layout and renders the TaskList
 * or ApiIntegration page based on active tab.
 */
function App() {
  const [activeTab, setActiveTab] = useState('tasks');

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            <span>Task Manager</span>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
          <button
            className={`nav-tab ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveTab('api')}
          >
            API Integration
          </button>
        </div>
      </nav>

      <main className="app-main">
        {activeTab === 'tasks' && <TaskList />}
        {activeTab === 'api' && <ApiIntegration />}
      </main>

      <footer className="app-footer">
        <p>Task Manager — Built with Django & React</p>
      </footer>
    </div>
  );
}

export default App;
