// src/services/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ensure this matches your backend port
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // You can add more specific error handling here
    if (error.response?.status === 404) {
      console.error('Endpoint not found');
    }
    
    return Promise.reject(error);
  }
);