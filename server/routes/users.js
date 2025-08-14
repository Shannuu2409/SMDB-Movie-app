import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
  try {
    const { uid, email, displayName } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const user = new User({
      uid,
      email,
      displayName,
      watchlist: []
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get user by UID
router.get('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user
router.put('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const updates = req.body;
    
    const user = await User.findOneAndUpdate(
      { uid },
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Add movie to watchlist
router.post('/:uid/watchlist', async (req, res) => {
  try {
    const { uid } = req.params;
    const movieData = req.body;
    
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if movie already exists in watchlist
    const existingMovie = user.watchlist.find(movie => movie.id === movieData.id);
    if (existingMovie) {
      return res.status(409).json({ error: 'Movie already in watchlist' });
    }
    
    user.watchlist.push(movieData);
    const updatedUser = await user.save();
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
});

// Remove movie from watchlist
router.delete('/:uid/watchlist/:movieId', async (req, res) => {
  try {
    const { uid, movieId } = req.params;
    
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.watchlist = user.watchlist.filter(movie => movie.id !== parseInt(movieId));
    const updatedUser = await user.save();
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
});

// Get user's watchlist
router.get('/:uid/watchlist', async (req, res) => {
  try {
    const { uid } = req.params;
    
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user.watchlist);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// Check if movie is in watchlist
router.get('/:uid/watchlist/:movieId', async (req, res) => {
  try {
    const { uid, movieId } = req.params;
    
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const exists = user.watchlist.some(movie => movie.id === parseInt(movieId));
    res.json({ exists });
  } catch (error) {
    console.error('Error checking watchlist status:', error);
    res.status(500).json({ error: 'Failed to check watchlist status' });
  }
});

// Update movie in watchlist (e.g., mark as watched)
router.patch('/:uid/watchlist/:movieId', async (req, res) => {
  try {
    const { uid, movieId } = req.params;
    const updates = req.body;
    
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const movieIndex = user.watchlist.findIndex(movie => movie.id === parseInt(movieId));
    if (movieIndex === -1) {
      return res.status(404).json({ error: 'Movie not found in watchlist' });
    }
    
    user.watchlist[movieIndex] = { ...user.watchlist[movieIndex], ...updates };
    const updatedUser = await user.save();
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating movie in watchlist:', error);
    res.status(500).json({ error: 'Failed to update movie in watchlist' });
  }
});

export { router as userRoutes };
