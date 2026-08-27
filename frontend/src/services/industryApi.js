import apiClient from './api';

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

export default industryApi;
