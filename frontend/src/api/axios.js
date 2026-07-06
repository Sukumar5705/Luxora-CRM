/**
 * BEFORE:
 *   window.location.href = '/login';
 *
 * AFTER:
 *   navigateTo('/login');
 *
 * WHY: window.location.href causes a full page reload, destroying the entire
 * React tree, all context state, and all component memory. Using navigateTo()
 * delegates to React Router's navigate(), keeping the app alive.
 *
 * ALSO ADDED:
 * - signal parameter on read methods so callers can pass an AbortController
 *   signal to cancel in-flight requests on component unmount.
 */

import axios from 'axios';
import { navigateTo } from '../utils/navigationService';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally — FIXED: no more full page reload
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect if the request was intentionally cancelled
    if (axios.isCancel(error)) return Promise.reject(error);

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigateTo('/login'); // ← was window.location.href = '/login'
    }
    return Promise.reject(error);
  }
);

// ====== AUTH ======
export const registerUser  = (data)        => API.post('/auth/register', data);
export const loginUser     = (data)        => API.post('/auth/login', data);
export const getMe         = (signal)      => API.get('/auth/me', { signal });
export const updateProfile = (data)        => API.put('/auth/profile', data);
export const getAllUsers    = ()            => API.get('/auth/users');

// ====== PROPERTIES ======
// signal is optional — pass an AbortController.signal to cancel on unmount
export const getProperties   = (params, signal) => API.get('/properties', { params, signal });
export const getPropertyById = (id, signal)     => API.get(`/properties/${id}`, { signal });
export const createProperty  = (data)           => API.post('/properties', data);
export const updateProperty  = (id, data)       => API.put(`/properties/${id}`, data);
export const deleteProperty  = (id)             => API.delete(`/properties/${id}`);
export const getPropertyStats = (signal)        => API.get('/properties/stats', { signal });

// ====== INQUIRIES ======
export const submitInquiry  = (data)       => API.post('/inquiries', data);
export const getInquiries   = (signal)     => API.get('/inquiries', { signal });
export const updateInquiry  = (id, data)   => API.put(`/inquiries/${id}`, data);
export const deleteInquiry  = (id)         => API.delete(`/inquiries/${id}`);

export default API;