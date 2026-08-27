import apiClient from './api';

/**
 * Authentication API Service
 * Interacts with /api/auth endpoints (Session managed via HTTP-Only cookies)
 */
export const authApi = {
  // Register a new user
  register: async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    return res.data;
  },

  // Login existing user (Server sets HTTP-Only 'token' cookie)
  login: async (credentials) => {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },

  // Logout user (Server clears cookie)
  logout: async () => {
    const res = await apiClient.post('/auth/logout');
    return res.data;
  },

  // Get current authenticated user session
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  // Get user notifications & unread count
  getNotifications: async () => {
    const res = await apiClient.get('/auth/notifications');
    return res.data;
  },

  // Mark all notifications as read
  markNotificationsAsRead: async () => {
    const res = await apiClient.patch('/auth/notifications/read');
    return res.data;
  }
};

export default authApi;
