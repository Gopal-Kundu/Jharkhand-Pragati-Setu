import apiClient from './api';

/**
 * Dynamic Notifications API Service
 */
export const notificationApi = {
  // Push a notification dynamically to any schema by ID and schemaName
  createNotification: async ({ title, description, id, schemaName }) => {
    const res = await apiClient.post('/notifications', { title, description, id, schemaName });
    return res.data;
  },

  // Fetch unified notifications across roles
  getMyNotifications: async () => {
    const res = await apiClient.get('/notifications/my');
    return res.data;
  },

  // Mark all notifications as read
  markAllRead: async () => {
    const res = await apiClient.patch('/notifications/read-all');
    return res.data;
  }
};

export default notificationApi;
