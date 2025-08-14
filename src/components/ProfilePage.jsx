import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MovieCard } from './MovieCard';
import { Button } from './ui/button';
import { LogOut, Edit, Save, X } from 'lucide-react';
import { Input } from './ui/input';

export const ProfilePage = () => {
  const { currentUser, userProfile, signout, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setEditDisplayName(userProfile.displayName || '');
    }
  }, [userProfile]);

  const handleSignOut = async () => {
    try {
      await signout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!editDisplayName.trim()) return;
    
    setLoading(true);
    try {
      await updateUserProfile({ displayName: editDisplayName.trim() });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditDisplayName(userProfile?.displayName || '');
    setIsEditing(false);
  };

  if (!currentUser || !userProfile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="container mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-gray-900 rounded-lg p-8 mb-8 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* User Info */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">User Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Display Name</label>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Input
                        value={editDisplayName}
                        onChange={(e) => setEditDisplayName(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                      <Button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-400 hover:bg-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-white text-lg">{userProfile.displayName}</span>
                      <Button
                        onClick={() => setIsEditing(true)}
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Email</label>
                  <span className="text-white text-lg">{userProfile.email}</span>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Member Since</label>
                  <span className="text-white text-lg">
                    {new Date(userProfile.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-500">
                    {userProfile.watchlist?.length || 0}
                  </div>
                  <div className="text-gray-400 text-sm">Movies in Watchlist</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {userProfile.watchlist?.filter(movie => movie.watched)?.length || 0}
                  </div>
                  <div className="text-gray-400 text-sm">Watched</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Watchlist Section */}
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">My Watchlist</h2>
          
          {userProfile.watchlist && userProfile.watchlist.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {userProfile.watchlist.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie}
                  onShowDetails={() => {}} // You can implement this if needed
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">
                Your watchlist is empty
              </div>
              <p className="text-gray-500">
                Start adding movies to your watchlist to see them here!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
