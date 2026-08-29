import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

/**
 * Base Axios Client
 * Configured with withCredentials = true to automatically transmit secure HTTP-Only Auth Cookies
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required for HTTP-Only Cookie authentication across domains
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000
});

// Response interceptor for consistent error unwrapping
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = error.response?.data?.message || error.message || 'Network request failed';
    const err = new Error(customError);
    err.response = error.response;
    err.status = error.response?.status;
    err.data = error.response?.data;
    return Promise.reject(err);
  }
);

export default apiClient;
