import axios from 'axios';

// In production (Vercel), api is served from the same origin at /api
// In development, we use localhost:5000/api
// Ensure the URL ends with /api even if the user forgets it in environment variables
let API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
if (API_URL && !API_URL.endsWith('/api') && !API_URL.endsWith('/api/')) {
  API_URL = `${API_URL.replace(/\/$/, '')}/api`;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
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

export const authService = {
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),

  // Register user
  register: (userData) => api.post('/auth/register', userData),

  // Get current user
  getCurrentUser: () => api.get('/auth/me'),
};

export const turfService = {
  // Get all turfs
  getAllTurfs: (params = {}) => api.get('/turfs', { params }),

  // Get single turf
  getTurf: (id) => api.get(`/turfs/${id}`),

  // Get turf availability
  getTurfAvailability: (id, date) => api.get(`/turfs/${id}/availability`, { params: { date } }),
};

export const bookingService = {
  // Create booking
  createBooking: (bookingData) => api.post('/bookings', bookingData),

  // Get all bookings
  getAllBookings: (params = {}) => api.get('/bookings', { params }),

  // Get single booking
  getBooking: (id) => api.get(`/bookings/${id}`),

  // Cancel booking
  cancelBooking: (id) => api.patch(`/bookings/${id}/cancel`),
};

export const statsService = {
  // Get stats
  getStats: () => api.get('/stats'),
};

export const ownerService = {
  // Get owner turfs
  getTurfs: () => api.get('/owner/turfs'),

  // Create turf
  createTurf: (turfData) => api.post('/owner/turfs', turfData),

  // Update turf
  updateTurf: (id, turfData) => api.put(`/owner/turfs/${id}`, turfData),

  // Delete turf
  deleteTurf: (id) => api.delete(`/owner/turfs/${id}`),

  // Get owner bookings
  getBookings: () => api.get('/owner/bookings'),

  // Get owner stats
  getStats: () => api.get('/owner/stats'),
};

export default api;
