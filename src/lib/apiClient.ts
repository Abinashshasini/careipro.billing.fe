import axios from 'axios';
import { authClient } from '@/utils/auth';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Request interceptor to add token and database key to all requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token and database key using auth functions
    const token = authClient.getToken();
    const datastoreKey = authClient.getDatabaseKey();

    // Add headers if available
    if (token) {
      config.headers['x-api-key'] = token;
    }
    if (datastoreKey) {
      config.headers['x-db-key'] = datastoreKey;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/';
    }
    return Promise.reject(error);
  },
);

export default apiClient;
