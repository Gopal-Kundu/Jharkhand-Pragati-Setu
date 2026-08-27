import apiClient from './api';

/**
 * AI Services API
 * Connects directly to backend AI endpoints for categorization, duplicate detection, and live chatbot
 */
export const aiApi = {
  // Automatic 10-domain categorization & university matching
  categorizeProblem: async (problemPayload) => {
    const res = await apiClient.post('/ai/categorize', problemPayload);
    return res.data;
  },

  // Live conversational AI assistant chat (Backend Call)
  sendChatMessage: async ({ message, contextRole, activeProblemId }) => {
    const res = await apiClient.post('/ai/chat', {
      message,
      contextRole,
      activeProblemId
    });
    return res.data;
  }
};

export default aiApi;
