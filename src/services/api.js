import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  getProfile: () => api.get('/auth/profile'),
};

// Business API
export const businessAPI = {
  reserveName: (data) => api.post('/business/reserve-name', data),
  submitApplication: (data) => api.post('/business/submit', data),
  getStatus: (registrationNumber) => api.get(`/business/status/${registrationNumber}`),
  getMyBusinesses: () => api.get('/business/my-businesses'),
};

// Public API
export const publicAPI = {
  search: (query, type) => api.get('/public/search', { params: { query, type } }),
  verify: (code) => api.get(`/public/verify/${code}`),
  checkName: (name) => api.get(`/public/check-name/${name}`),
};

// Payment API
export const paymentAPI = {
  initiatePayment: (businessId) => api.post(`/payments/initiate/${businessId}`),
  getPaymentStatus: (invoiceNumber) => api.get(`/payments/status/${invoiceNumber}`),
};

// LBR API
export const lbrAPI = {
  getApplications: () => api.get('/lbr/applications'),
  getApplication: (id) => api.get(`/lbr/applications/${id}`),
  updateApplication: (id, data) => api.put(`/lbr/applications/${id}`, data),
  assignOfficer: (applicationId, officerId, stage) => api.post('/lbr/assign', { applicationId, officerId, stage }),
};

// LRA API
export const lraAPI = {
  getBusinessesForAssessment: () => api.get('/lra/businesses'),
  submitAssessment: (data) => api.post('/lra/assess', data),
};

// Admin API
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  getAuditLogs: () => api.get('/admin/audit-logs'),
  getStats: () => api.get('/admin/stats'),
};

export default api;
