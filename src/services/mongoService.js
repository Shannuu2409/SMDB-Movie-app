import axios from 'axios';

// Force Vercel redeploy - timestamp: ${new Date().toISOString()}
const API_BASE_URL = import.meta.env.VITE_MONGODB_API_URL || 'http://localhost:5000/api';

// Add debugging to see what's happening
console.log('🔍 MongoDB API URL:', API_BASE_URL);
console.log('🔍 Environment variable present:', !!import.meta.env.VITE_MONGODB_API_URL);
console.log('🔍 Full environment variable value:', import.meta.env.VITE_MONGODB_API_URL);
console.log('🔍 Current timestamp:', new Date().toISOString());

const mongoService = {
  // Test backend connectivity
  async testConnection() {
    try {
      console.log('🔍 Testing backend connection at:', `${API_BASE_URL}/health`);
      console.log('🔍 Full URL being used:', `${API_BASE_URL}/health`);
      const response = await axios.get(`${API_BASE_URL}/health`);
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
      const response = await axios.post(`${API_BASE_URL}/users`, userData);
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
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
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
      const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Watchlist management
  async addToWatchlist(userId, movieData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/${userId}/watchlist`, movieData);
      return response.data;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  },

  async removeFromWatchlist(userId, movieId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/users/${userId}/watchlist/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  },

  async getWatchlist(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/watchlist`);
      return response.data;
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      throw error;
    }
  },

  async isInWatchlist(userId, movieId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/watchlist/${movieId}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking watchlist status:', error);
      return false;
    }
  }
};

export default mongoService;
