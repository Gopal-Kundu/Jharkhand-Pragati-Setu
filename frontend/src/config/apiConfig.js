/**
 * Centralized API & Backend Configuration
 * Production Backend URL: https://backend-psi-jade-47.vercel.app
 */
export const BACKEND_URL = import.meta.env.VITE_API_BASE_URL 
  ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '') 
  : (import.meta.env.PROD || window.location.hostname !== 'localhost'
      ? 'https://backend-psi-jade-47.vercel.app' 
      : 'http://localhost:5000');

export const API_BASE_URL = `${BACKEND_URL}/api`;

export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: `${API_BASE_URL}/auth/register`,
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_LOGOUT: `${API_BASE_URL}/auth/logout`,
  AUTH_ME: `${API_BASE_URL}/auth/me`,

  // Problems & Workflow
  PROBLEMS: `${API_BASE_URL}/problems`,
  PROBLEM_BY_ID: (id) => `${API_BASE_URL}/problems/${id}`,
  PROBLEM_ALLOCATE: (id) => `${API_BASE_URL}/problems/${id}/allocate`,
  PROBLEM_PROPOSAL: (id) => `${API_BASE_URL}/problems/${id}/proposal`,
  PROBLEM_FUND: (id) => `${API_BASE_URL}/problems/${id}/fund`,
  PROBLEM_MILESTONE: (id, mId) => `${API_BASE_URL}/problems/${id}/milestones/${mId}`,
  PROBLEM_VALIDATE: (id) => `${API_BASE_URL}/problems/${id}/validate`,

  // AI Services
  AI_CATEGORIZE: `${API_BASE_URL}/ai/categorize`,
  AI_CHAT: `${API_BASE_URL}/ai/chat`,

  // Analytics & GIS Telemetry
  ANALYTICS: `${API_BASE_URL}/analytics`,

  // Universities & Industry
  UNIVERSITIES: `${API_BASE_URL}/universities`,
  INDUSTRY: `${API_BASE_URL}/industry`,

  // Notifications & Email
  SEND_EMAIL: `${API_BASE_URL}/notifications/send`
};

export default {
  BACKEND_URL,
  API_BASE_URL,
  API_ENDPOINTS
};
