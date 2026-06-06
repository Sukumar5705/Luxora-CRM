import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const registerUser   = (data) => API.post('/auth/register', data);
export const loginUser      = (data) => API.post('/auth/login', data);
export const getMe          = ()     => API.get('/auth/me');
export const updateProfile  = (data) => API.put('/auth/profile', data);
export const getAllUsers     = ()     => API.get('/auth/users');

export const getProperties    = (params) => API.get('/properties', { params });
export const getPropertyById  = (id)     => API.get(`/properties/${id}`);
export const createProperty   = (data)   => API.post('/properties', data);
export const updateProperty   = (id, data) => API.put(`/properties/${id}`, data);
export const deleteProperty   = (id)     => API.delete(`/properties/${id}`);
export const getPropertyStats = ()       => API.get('/properties/stats');

export const submitInquiry  = (data)     => API.post('/inquiries', data);
export const getInquiries   = ()         => API.get('/inquiries');
export const updateInquiry  = (id, data) => API.put(`/inquiries/${id}`, data);
export const deleteInquiry  = (id)       => API.delete(`/inquiries/${id}`);

export default API;
