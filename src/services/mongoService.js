import axios from 'axios';

// Force the correct URL - bypass any caching issues
const API_BASE_URL = 'https://smdb-movie-app.onrender.com/api';

// Configure axios for CORS
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add debugging to see what's happening
console.log('🔍 MongoDB API URL (HARDCODED):', API_BASE_URL);
console.log('🔍 Environment variable present:', !!import.meta.env.VITE_MONGODB_API_URL);
console.log('🔍 Full environment variable value:', import.meta.env.VITE_MONGODB_API_URL);
console.log('🔍 Current timestamp:', new Date().toISOString());

const mongoService = {
  // Simple test with fetch instead of axios
  async simpleTest() {
    try {
      console.log('🔍 Simple fetch test to:', `${API_BASE_URL}/health`);
      const response = await fetch(`${API_BASE_URL}/health`);
      console.log('🔍 Fetch response status:', response.status);
      const data = await response.json();
      console.log('✅ Simple fetch successful:', data);
      return data;
    } catch (error) {
      console.error('❌ Simple fetch failed:', error);
      throw error;
    }
  },

  // Test backend connectivity
  async testConnection() {
    try {
      console.log('🔍 Testing backend connection at:', `${API_BASE_URL}/health`);
      console.log('🔍 Full URL being used:', `${API_BASE_URL}/health`);
      const response = await apiClient.get('/health');
      console.log('✅ Backend connection successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      console.error('❌ Full error object:', error);
      throw error;
    }
  },

  // User management
  async createUser(userData) {
    try {
      console.log('🔍 Attempting to create user at:', `${API_BASE_URL}/users`);
      const response = await apiClient.post('/users', userData);
      console.log('✅ User created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating user:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      throw error;
    }
  },

  async getUser(userId) {
    try {
      console.log('🔍 Attempting to get user at:', `${API_BASE_URL}/users/${userId}`);
      const response = await apiClient.get(`/users/${userId}`);
      console.log('✅ User fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      throw error;
    }
  },

  async updateUser(userId, userData) {
    try {
      const response = await apiClient.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Watchlist management
  async addToWatchlist(userId, movieData) {
    try {
      const response = await apiClient.post(`/users/${userId}/watchlist`, movieData);
      return response.data;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  },

  async removeFromWatchlist(userId, movieId) {
    try {
      const response = await apiClient.delete(`/users/${userId}/watchlist/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  },

  async getWatchlist(userId) {
    try {
      const response = await apiClient.get(`/users/${userId}/watchlist`);
      return response.data;
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      throw error;
    }
  },

  async isInWatchlist(userId, movieId) {
    try {
      const response = await apiClient.get(`/users/${userId}/watchlist/${movieId}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking watchlist status:', error);
      return false;
    }
  }
};

export default mongoService;
