import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import mongoService from '../services/mongoService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  const signup = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase profile
      await updateProfile(userCredential.user, { displayName });
      
      // Create user in MongoDB
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName,
        createdAt: new Date().toISOString(),
        watchlist: []
      };
      
      await mongoService.createUser(userData);
      
      return userCredential.user;
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  };

  // Sign in function
  const signin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user profile from MongoDB
      const profile = await mongoService.getUser(userCredential.user.uid);
      setUserProfile(profile);
      
      return userCredential.user;
    } catch (error) {
      console.error('Error during signin:', error);
      throw error;
    }
  };

  // Sign out function
  const signout = () => {
    return signOut(auth);
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (currentUser) {
        const updatedProfile = await mongoService.updateUser(currentUser.uid, updates);
        setUserProfile(updatedProfile);
        return updatedProfile;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Watchlist functions
  const addToWatchlist = async (movie) => {
    try {
      if (currentUser && userProfile) {
        const updatedProfile = await mongoService.addToWatchlist(currentUser.uid, movie);
        setUserProfile(updatedProfile);
        return updatedProfile;
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      if (currentUser && userProfile) {
        const updatedProfile = await mongoService.removeFromWatchlist(currentUser.uid, movieId);
        setUserProfile(updatedProfile);
        return updatedProfile;
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  };

  const isInWatchlist = async (movieId) => {
    try {
      if (currentUser) {
        return await mongoService.isInWatchlist(currentUser.uid, movieId);
      }
      return false;
    } catch (error) {
      console.error('Error checking watchlist status:', error);
      return false;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    // Test backend connection on app load
    const testBackend = async () => {
      try {
        console.log('🔍 Testing backend connection on app load...');
        await mongoService.testConnection();
        console.log('✅ Backend is reachable!');
      } catch (error) {
        console.error('❌ Backend is not reachable:', error);
      }
    };
    
    testBackend();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Fetch user profile from MongoDB
          const profile = await mongoService.getUser(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // If user doesn't exist in MongoDB, create them
          try {
            const userData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || 'User',
              createdAt: new Date().toISOString(),
              watchlist: []
            };
            await mongoService.createUser(userData);
            setUserProfile(userData);
          } catch (createError) {
            console.error('Error creating user profile:', createError);
          }
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    signin,
    signout,
    updateUserProfile,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
