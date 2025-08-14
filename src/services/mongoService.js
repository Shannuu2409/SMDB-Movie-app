import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_MONGODB_API_URL || 'http://localhost:5000/api';

const mongoService = {
  // User management
  async createUser(userData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async getUser(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
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
