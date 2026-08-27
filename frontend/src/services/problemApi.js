import apiClient from './api';

/**
 * Problem Lifecycle & Innovation Workflow API Service
 * Handles problem collection, multipart evidence upload, triage, proposals, funding, and milestones
 */
export const problemApi = {
  // Fetch problems list with filters
  getProblems: async (params = {}) => {
    const res = await apiClient.get('/problems', { params });
    return res.data;
  },

  // Fetch single problem by ID or Ticket ID
  getProblemById: async (id) => {
    const res = await apiClient.get(`/problems/${id}`);
    return res.data;
  },

  // Fetch problems submitted by currently logged-in user
  getMyProblems: async () => {
    const res = await apiClient.get('/problems/user/my');
    return res.data;
  },

  // Submit new problem with multimedia files (FormData)
  submitProblem: async (formData) => {
    const res = await apiClient.post('/problems', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },

  // Government triage & university allocation
  allocateUniversity: async (problemId, allocationData) => {
    const res = await apiClient.patch(`/problems/${problemId}/allocate`, allocationData);
    return res.data;
  },

  // University multidisciplinary proposal submission
  submitProposal: async (problemId, proposalData) => {
    const res = await apiClient.post(`/problems/${problemId}/proposal`, proposalData);
    return res.data;
  },

  // Industry CSR grant funding pledge
  pledgeFunding: async (problemId, fundingData) => {
    const res = await apiClient.post(`/problems/${problemId}/fund`, fundingData);
    return res.data;
  },

  // Update milestone progress & deliverables
  updateMilestone: async (problemId, milestoneId, milestoneData) => {
    const res = await apiClient.patch(`/problems/${problemId}/milestones/${milestoneId}`, milestoneData);
    return res.data;
  },

  // Final solution validation & social impact certification
  validateSolution: async (problemId, validationData) => {
    const res = await apiClient.patch(`/problems/${problemId}/validate`, validationData);
    return res.data;
  }
};

export default problemApi;
