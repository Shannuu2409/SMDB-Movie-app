# SMDB Setup Guide

This guide will help you set up the Firebase authentication system and MongoDB backend for the SMDB movie application.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Firebase project

## 1. Firebase Setup

### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication
   - Click "Save"

### Get Firebase Configuration

1. In your Firebase project, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web app icon (</>)
5. Register your app with a nickname
6. Copy the configuration object

## 2. MongoDB Setup

### Option A: Local MongoDB

1. Install MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Create a database named `smdb`

### Option B: MongoDB Atlas (Recommended for production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string

## 3. Environment Configuration

### Frontend (.env file)

Create a `.env` file in the root directory:

```env
# TMDB API Credentials
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_ACCESS_TOKEN=your_tmdb_access_token_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id_here

# MongoDB Backend API URL
VITE_MONGODB_API_URL=http://localhost:5000/api
```

### Backend (.env file)

Create a `.env` file in the `server` directory:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/smdb

# Server Port
PORT=5000
```

## 4. Install Dependencies

### Frontend
```bash
npm install
```

### Backend
```bash
cd server
npm install
```

## 5. Start the Application

### Start Backend Server
```bash
cd server
npm run dev
```

The backend will start on `http://localhost:5000`

### Start Frontend
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 6. Features Available

### Authentication
- ✅ User registration with email/password
- ✅ User login/logout
- ✅ Protected routes
- ✅ User profile management

### Watchlist Management
- ✅ Add movies to watchlist
- ✅ Remove movies from watchlist
- ✅ View personal watchlist
- ✅ Watchlist status indicators

### User Profile
- ✅ Display user information
- ✅ Edit display name
- ✅ View watchlist statistics
- ✅ Sign out functionality

## 7. API Endpoints

### Users
- `POST /api/users` - Create user
- `GET /api/users/:uid` - Get user by UID
- `PUT /api/users/:uid` - Update user

### Watchlist
- `POST /api/users/:uid/watchlist` - Add movie to watchlist
- `DELETE /api/users/:uid/watchlist/:movieId` - Remove movie from watchlist
- `GET /api/users/:uid/watchlist` - Get user's watchlist
- `GET /api/users/:uid/watchlist/:movieId` - Check if movie is in watchlist
- `PATCH /api/users/:uid/watchlist/:movieId` - Update movie in watchlist

## 8. Troubleshooting

### Common Issues

1. **Firebase Authentication Error**
   - Verify Firebase configuration in `.env`
   - Check if Email/Password auth is enabled
   - Ensure project ID matches

2. **MongoDB Connection Error**
   - Verify MongoDB is running
   - Check connection string in backend `.env`
   - Ensure database exists

3. **CORS Error**
   - Backend CORS is configured for development
   - For production, update CORS settings

4. **API Endpoints Not Working**
   - Ensure backend server is running
   - Check `VITE_MONGODB_API_URL` in frontend `.env`
   - Verify backend port matches

### Debug Mode

The application includes comprehensive logging:
- Check browser console for frontend logs
- Check terminal for backend logs
- API calls are logged with status codes

## 9. Production Deployment

### Frontend
- Build with `npm run build`
- Deploy to Vercel, Netlify, or similar

### Backend
- Set production MongoDB URI
- Use environment variables for sensitive data
- Deploy to Heroku, Railway, or similar

### Environment Variables
- Never commit `.env` files
- Use platform environment variables
- Keep Firebase config secure

## 10. Security Notes

- Firebase handles authentication security
- MongoDB connection strings should be private
- API endpoints are public (consider adding auth middleware)
- User data is isolated by UID

## Support

If you encounter issues:
1. Check the console logs
2. Verify all environment variables
3. Ensure services are running
4. Check network connectivity

The application is designed to be robust and provide clear error messages for common issues.
