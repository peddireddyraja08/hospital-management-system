import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  refreshToken: (refreshToken) => api.post('/auth/refresh', null, { params: { refreshToken } }),
};

// Patient API
export const patientAPI = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  getByPatientId: (patientId) => api.get(`/patients/patient-id/${patientId}`),
  create: (patient) => api.post('/patients', patient),
  update: (id, patient) => api.put(`/patients/${id}`, patient),
  delete: (id) => api.delete(`/patients/${id}`),
  searchByEmail: (email) => api.get('/patients/search', { params: { email } }),
};

// Medical Record API
export const medicalRecordAPI = {
  getAll: () => api.get('/medical-records'),
  getById: (id) => api.get(`/medical-records/${id}`),
  getByPatientId: (patientId) => api.get(`/medical-records/patient/${patientId}`),
  getByDoctorId: (doctorId) => api.get(`/medical-records/doctor/${doctorId}`),
  create: (record) => api.post('/medical-records', record),
  update: (id, record) => api.put(`/medical-records/${id}`, record),
  delete: (id) => api.delete(`/medical-records/${id}`),
};

// Vital Signs API
export const vitalSignAPI = {
  getById: (id) => api.get(`/vital-signs/${id}`),
  getByPatientId: (patientId) => api.get(`/vital-signs/patient/${patientId}`),
  create: (vitalSign) => api.post('/vital-signs', vitalSign),
  update: (id, vitalSign) => api.put(`/vital-signs/${id}`, vitalSign),
  delete: (id) => api.delete(`/vital-signs/${id}`),
};

// Physician Order API
export const physicianOrderAPI = {
  getAll: () => api.get('/physician-orders'),
  getById: (id) => api.get(`/physician-orders/${id}`),
  getByPatientId: (patientId) => api.get(`/physician-orders/patient/${patientId}`),
  getByDoctorId: (doctorId) => api.get(`/physician-orders/doctor/${doctorId}`),
  getByStatus: (status) => api.get(`/physician-orders/status/${status}`),
  create: (order) => api.post('/physician-orders', order),
  update: (id, order) => api.put(`/physician-orders/${id}`, order),
  updateStatus: (id, status) => api.patch(`/physician-orders/${id}/status`, null, { params: { status } }),
  cancel: (id) => api.delete(`/physician-orders/${id}/cancel`),
};

export default api;
