import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { userRoutes } from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check (available regardless of DB state)
app.get('/api/health', (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.json({ status: 'OK', message: 'SMDB Backend is running', dbConnected: dbReady });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smdb';
console.log('🔍 Attempting to connect to MongoDB...');
console.log('🔍 MongoDB URI present:', !!process.env.MONGODB_URI);
console.log('🔍 MongoDB URI starts with:', MONGODB_URI.substring(0, 20) + '...');

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000, // Try for up to 10s
    socketTimeoutMS: 45000,
    // NOTE: Do NOT disable buffering. Leaving defaults prevents 'bufferCommands=false' errors.
  })
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error code:', error.code);
  });

// Connection event listeners
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error event:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});

// Routes
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
