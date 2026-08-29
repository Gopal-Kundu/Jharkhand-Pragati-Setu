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
  },
  getMyUniversity: async () => {
    const res = await apiClient.get('/universities/my');
    return res.data;
  },
  registerUniversity: async (universityData) => {
    const res = await apiClient.post('/universities/register', universityData);
    return res.data;
  },
  updateMyUniversity: async (universityData) => {
    const res = await apiClient.put('/universities/my', universityData);
    return res.data;
  },
  getUniversityNotifications: async () => {
    const res = await apiClient.get('/universities/my/notifications');
    return res.data;
  },
  markUniversityNotificationsRead: async () => {
    const res = await apiClient.patch('/universities/my/notifications/read');
    return res.data;
  },
  createProposal: async (proposalData) => {
    const res = await apiClient.post('/universities/proposals', proposalData);
    return res.data;
  },
  respondToIndustryOffer: async (proposalId, responseData) => {
    const res = await apiClient.post(`/universities/proposals/${proposalId}/respond-offer`, responseData);
    return res.data;
  },
  completeProposal: async (proposalId, completionData = {}) => {
    const res = await apiClient.post(`/universities/proposals/${proposalId}/complete`, completionData);
    return res.data;
  }
};

export const industryApi = {
  getMyIndustry: async () => {
    const res = await apiClient.get('/industry/my-profile');
    return res.data;
  },
  registerIndustry: async (industryData) => {
    const res = await apiClient.post('/industry/register', industryData);
    return res.data;
  },
  updateMyIndustry: async (industryData) => {
    const res = await apiClient.put('/industry/my-profile', industryData);
    return res.data;
  },
  getDomainProposals: async () => {
    const res = await apiClient.get('/industry/proposals');
    return res.data;
  },
  makeProposalOffer: async (proposalId, offerData) => {
    const res = await apiClient.post(`/industry/proposals/${proposalId}/offer`, offerData);
    return res.data;
  },
  getIndustryNotifications: async () => {
    const res = await apiClient.get('/industry/notifications');
    return res.data;
  },
  markIndustryNotificationsRead: async () => {
    const res = await apiClient.post('/industry/notifications/mark-read');
    return res.data;
  },
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
