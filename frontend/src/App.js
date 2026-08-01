import React from 'react';
import TaskList from './components/TaskList';
import './App.css';

/**
 * App Component
 * 
 * Root component of the application.
 * Provides the main layout and renders the TaskList container.
 */
function App() {
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

      <main className="app-main">
        <TaskList />
      </main>

      <footer className="app-footer">
        <p>Task Manager — Built with Django & React</p>
      </footer>
    </div>
  );
}

export default App;
