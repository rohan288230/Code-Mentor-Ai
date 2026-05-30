import axios from 'axios';
import { ROUTES } from '../constants/routes.js';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log("API URL:", import.meta.env.VITE_API_URL);
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const originalRequestUrl = error.config?.url || '';
      
      // Do not redirect on 401 if it's the profile check! This causes infinite refresh loop.
      if (status === 401 && !originalRequestUrl.includes('/auth/profile')) {
        window.location.href = ROUTES.LOGIN;
      } else if (status === 500) {
        console.error('Server Error:', error.response.data?.message);
      }
    } else if (error.request) {
      console.error('Network Error: No response received');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
