import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { Button } from "@/components/ui/button";
import { Menu, User, Home, Film, Tv, Heart, Zap, LogOut, Bookmark } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { LoginModal } from "./auth/LoginModal";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile, signout } = useAuth();

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    // Navigate to home with search query
    if (value.trim()) {
      navigate(`/?search=${encodeURIComponent(value)}`);
    } else {
      navigate('/');
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setShowProfileMenu(false);
    console.log("Navigating to:", path);
  };

  const handleProfileClick = () => {
    if (currentUser) {
      setShowProfileMenu(!showProfileMenu);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleSignOut = async () => {
    try {
      await signout();
      setShowProfileMenu(false);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Get current active tab from location
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/movies') return 'movies';
    if (path === '/tv-series') return 'tv';
    if (path === '/anime') return 'anime';
    if (path === '/profile') return 'profile';
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 
                className="text-2xl font-bold text-white cursor-pointer hover:text-red-500 transition-colors font-montserrat"
                onClick={() => handleNavigation('/')}
              >
                SMDB .
              </h1>
              
              <div className="hidden md:flex space-x-6">
                <Button 
                  variant="ghost" 
                  className={`text-white hover:text-red-500 transition-colors ${activeTab === 'home' ? 'text-red-500' : ''}`}
                  onClick={() => handleNavigation('/')}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
                <Button 
                  variant="ghost" 
                  className={`text-white hover:text-red-500 transition-colors ${activeTab === 'movies' ? 'text-red-500' : ''}`}
                  onClick={() => handleNavigation('/movies')}
                >
                  <Film className="w-4 h-4 mr-2" />
                  Movies
                </Button>
                <Button 
                  variant="ghost" 
                  className={`text-white hover:text-red-500 transition-colors ${activeTab === 'tv' ? 'text-red-500' : ''}`}
                  onClick={() => handleNavigation('/tv-series')}
                >
                  <Tv className="w-4 h-4 mr-2" />
                  TV Shows
                </Button>
                <Button 
                  variant="ghost" 
                  className={`text-white hover:text-red-500 transition-colors ${activeTab === 'anime' ? 'text-red-500' : ''}`}
                  onClick={() => handleNavigation('/anime')}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Anime
                </Button>
                {currentUser && (
                  <Button 
                    variant="ghost" 
                    className={`text-white hover:text-red-500 transition-colors ${activeTab === 'profile' ? 'text-red-500' : ''}`}
                    onClick={() => handleNavigation('/profile')}
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    My List
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <SearchBar 
                value={searchQuery} 
                onChange={handleSearchChange} 
              />
              
              {/* Profile Button */}
              <div className="relative">
                <Button
                  onClick={handleProfileClick}
                  variant="ghost"
                  className="text-white hover:text-red-500 transition-colors"
                >
                  {currentUser ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="hidden md:block">{userProfile?.displayName || 'User'}</span>
                    </div>
                  ) : (
                    <>
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>

                {/* Profile Dropdown Menu */}
                {currentUser && showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-lg shadow-xl border border-gray-700 py-2">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-white font-semibold">{userProfile?.displayName}</p>
                      <p className="text-gray-400 text-sm">{userProfile?.email}</p>
                    </div>
                    
                    <div className="py-2">
                      <button
                        onClick={() => handleNavigation('/profile')}
                        className="w-full text-left px-4 py-2 text-white hover:bg-gray-800 transition-colors flex items-center"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </button>
                      <button
                        onClick={() => handleNavigation('/profile')}
                        className="w-full text-left px-4 py-2 text-white hover:bg-gray-800 transition-colors flex items-center"
                      >
                        <Bookmark className="w-4 h-4 mr-2" />
                        Watchlist ({userProfile?.watchlist?.length || 0})
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 transition-colors flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};


