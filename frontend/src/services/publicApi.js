/**
 * Public API Service Layer
 *
 * Integrates with external public APIs (GitHub API).
 * Follows Single Responsibility Principle by isolating
 * third-party API communication from UI components.
 */

import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';

const publicApiClient = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3+json',
  },
  timeout: 15000,
});

publicApiClient.interceptors.request.use(
  (config) => {
    console.log(`Public API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

publicApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message
      || error.response?.statusText
      || error.message
      || 'An unexpected error occurred';

    console.error('Public API Error:', message);
    return Promise.reject(new Error(message));
  }
);

/**
 * GitHub API Service
 *
 * Fetches public repository data from GitHub.
 */
export const githubApi = {
  /**
   * Fetch public repositories for a user
   * @param {string} username - GitHub username (default: 'octocat')
   * @param {number} perPage - Number of repos per page (default: 12)
   * @returns {Promise<Array>} List of public repositories
   */
  getUserRepos: async (username = 'octocat', perPage = 12) => {
    const response = await publicApiClient.get(`/users/${username}/repos`, {
      params: {
        per_page: perPage,
        sort: 'updated',
        order: 'desc',
      },
    });
    return response.data;
  },

  /**
   * Fetch a single repository by owner and name
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<Object>} Repository details
   */
  getRepo: async (owner, repo) => {
    const response = await publicApiClient.get(`/repos/${owner}/${repo}`);
    return response.data;
  },

  /**
   * Fetch repository languages
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<Object>} Language usage map
   */
  getRepoLanguages: async (owner, repo) => {
    const response = await publicApiClient.get(`/repos/${owner}/${repo}/languages`);
    return response.data;
  },
};

export default publicApiClient;