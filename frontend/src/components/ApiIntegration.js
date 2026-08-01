import React, { useState, useEffect } from 'react';
import { githubApi } from '../services/publicApi';

/**
 * ApiIntegration Component
 *
 * Fetches and displays public GitHub repositories.
 * Demonstrates third-party API integration with loading,
 * error, and success states.
 */
function ApiIntegration() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username] = useState('octocat');

  useEffect(() => {
    let cancelled = false;

    const fetchRepos = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await githubApi.getUserRepos(username, 12);
        if (!cancelled) {
          setRepos(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchRepos();

    return () => {
      cancelled = true;
    };
  }, [username]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCount = (count) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  if (loading) {
    return (
      <div className="api-integration">
        <div className="api-section-header">
          <h2>GitHub Repositories</h2>
          <span className="api-badge">Public API</span>
        </div>
        <div className="loading-state">
          <div className="spinner" />
          <p>Fetching repositories from GitHub...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="api-integration">
        <div className="api-section-header">
          <h2>GitHub Repositories</h2>
          <span className="api-badge">Public API</span>
        </div>
        <div className="error-banner">
          <span>Failed to load repositories: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="api-integration">
      <div className="api-section-header">
        <h2>GitHub Repositories</h2>
        <span className="api-badge">Public API</span>
      </div>
      <p className="api-description">
        Showing the latest public repositories from GitHub user{' '}
        <strong>@{username}</strong> via the GitHub REST API.
      </p>
      <div className="repos-grid">
        {repos.map((repo) => (
          <div key={repo.id} className="repo-card">
            <div className="repo-card-header">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 11-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
              </svg>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="repo-name"
              >
                {repo.name}
              </a>
            </div>
            <p className="repo-description">
              {repo.description || 'No description provided.'}
            </p>
            <div className="repo-meta">
              {repo.language && (
                <span className="repo-language">
                  <span className="language-dot" />
                  {repo.language}
                </span>
              )}
              <span className="repo-stat" title="Stars">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                </svg>
                {formatCount(repo.stargazers_count)}
              </span>
              <span className="repo-stat" title="Forks">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v2.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013.5 6.25v-.878a2.25 2.25 0 111.5 0zM5 3.25a.75.75 0 10-1.5 0 .75.75 0 001.5 0zm6.75.75a.75.75 0 100-1.5.75.75 0 000 1.5zm-3 8.75a.75.75 0 10-1.5 0 .75.75 0 001.5 0z" />
                </svg>
                {formatCount(repo.forks_count)}
              </span>
              <span className="repo-date">Updated {formatDate(repo.updated_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApiIntegration;