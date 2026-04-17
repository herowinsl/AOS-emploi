import axios from "axios";

export const IS_MOCK = true;

const WP_BASE = import.meta.env.VITE_WP_API_URL;

export const wpApi = axios.create({
  baseURL: WP_BASE,
  timeout: 8000,
});

// Add auth token to all requests if available
wpApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('aos_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const endpoints = {
  posts: "/wp/v2/posts",
  pages: "/wp/v2/pages",
  services: "/wp/v2/services",
  portfolio: "/wp/v2/portfolio",
  media: "/wp/v2/media",
};

// AOS Registration endpoints
export const aosEndpoints = {
  register: () => wpApi.post('/aos/v1/register'),
  signIn: (email, uniqueKey) => wpApi.post('/aos/v1/signin', { 
    email, 
    unique_key: uniqueKey 
  }),
  getPending: () => wpApi.get('/aos/v1/pending'),
  approve: (id) => wpApi.post(`/aos/v1/approve/${id}`),
  reject: (id) => wpApi.post(`/aos/v1/reject/${id}`),
};

// Auth token management
export const setAuthToken = (token) => {
  localStorage.setItem('aos_auth_token', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('aos_auth_token');
};

export const clearAuthToken = () => {
  localStorage.removeItem('aos_auth_token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('aos_auth_token');
};
