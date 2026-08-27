import apiClient from './api';

/**
 * Analytics API Service
 * Fetches real-time telemetry, domain distribution, and GIS hotspot coordinates
 */
export const analyticsApi = {
  getAnalytics: async () => {
    const res = await apiClient.get('/analytics');
    return res.data;
  }
};

export default analyticsApi;
