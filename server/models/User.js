import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  poster: String,
  backdrop: String,
  overview: String,
  genre: String,
  year: String,
  rating: String,
  addedAt: {
    type: Date,
    default: Date.now
  },
  watched: {
    type: Boolean,
    default: false
  }
});

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  watchlist: [movieSchema],
  preferences: {
    favoriteGenres: [String],
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ uid: 1 });
userSchema.index({ email: 1 });

export const User = mongoose.model('User', userSchema);
