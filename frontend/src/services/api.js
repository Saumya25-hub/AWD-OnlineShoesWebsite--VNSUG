import axios from 'axios';

export const API_BASE_URL = 'http://localhost:5000/api';
export const UPLOADS_BASE_URL = 'http://localhost:5000/uploads';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const parsed = JSON.parse(userInfo);
    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
