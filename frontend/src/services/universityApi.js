import apiClient from './api';

/**
 * University & Industry API Services
 */
export const universityApi = {
  getUniversities: async (params = {}) => {
    const res = await apiClient.get('/universities', { params });
    return res.data;
  },
  getUniversityById: async (id) => {
    const res = await apiClient.get(`/universities/${id}`);
    return res.data;
  }
};

export const industryApi = {
  getIndustryPartners: async (params = {}) => {
    const res = await apiClient.get('/industry', { params });
    return res.data;
  },
  getIndustryPartnerById: async (id) => {
    const res = await apiClient.get(`/industry/${id}`);
    return res.data;
  }
};

export default {
  universityApi,
  industryApi
};
