import { useState, useEffect } from "react";
import { X, Play, Plus, Share2, Volume2, VolumeX, Youtube, Heart, Bookmark, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import mongoService from "../services/mongoService";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Debug: Log API credentials (without exposing the actual values)
console.log("API_KEY present:", !!API_KEY);
console.log("ACCESS_TOKEN present:", !!ACCESS_TOKEN);
console.log("TMDB_BASE_URL:", TMDB_BASE_URL);

const fetchTMDB = async (path, params = {}) => {
  const query = new URLSearchParams(params);
  const url = `${TMDB_BASE_URL}${path}?${query.toString()}`;
  console.log("Fetching TMDB URL:", url);
  
  if (ACCESS_TOKEN) {
    console.log("Using ACCESS_TOKEN for authentication");
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    });
    console.log("API response status:", res.status);
    return res;
  }
  
  console.log("Using API_KEY for authentication");
  const urlWithKey = `${TMDB_BASE_URL}${path}?${new URLSearchParams({ ...params, api_key: API_KEY }).toString()}`;
  const res = await fetch(urlWithKey);
  console.log("API response status:", res.status);
  return res;
};

export const MovieDetailModal = ({ movie, isOpen, onClose }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [cast, setCast] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  
  const { currentUser, addToWatchlist, removeFromWatchlist } = useAuth();

  useEffect(() => {
    if (isOpen && movie) {
      fetchMovieDetails();
      checkWatchlistStatus();
    }
  }, [isOpen, movie]);

  const fetchMovieDetails = async () => {
    if (!movie) return;
    
    try {
      // Debug: Log the movie object to see its structure
      console.log("Fetching details for movie:", movie);
      
      // Fetch trailer
      if (movie.id) {
        const trailerRes = await fetchTMDB(`/movie/${movie.id}/videos`);
        if (trailerRes.ok) {
          const trailerData = await trailerRes.json();
          console.log("Trailer API response:", trailerData);
          const officialTrailer = trailerData.results?.find(
            video => video.type === "Trailer" && video.site === "YouTube"
          );
          if (officialTrailer) {
            setTrailerKey(officialTrailer.key);
            console.log("Found trailer key:", officialTrailer.key);
          } else {
            console.log("No official trailer found");
          }
        } else {
          console.error("Trailer API failed:", trailerRes.status, trailerRes.statusText);
        }
      } else {
        console.error("Movie ID is missing:", movie);
      }

      // Fetch cast
      if (movie.id) {
        const castRes = await fetchTMDB(`/movie/${movie.id}/credits`);
        if (castRes.ok) {
          const castData = await castRes.json();
          setCast(castData.cast?.slice(0, 10) || []);
        } else {
          console.error("Cast API failed:", castRes.status, castRes.statusText);
        }
      }
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
    }
  };

  const checkWatchlistStatus = async () => {
    if (currentUser && movie?.id) {
      try {
        const exists = await mongoService.isInWatchlist(currentUser.uid, movie.id);
        setIsInWatchlist(exists);
      } catch (error) {
        console.error("Error checking watchlist status:", error);
      }
    }
  };

  const handlePlay = () => {
    if (trailerKey) {
      setShowTrailer(true);
    } else {
      // Show helpful message when trailer is not available
      if (!API_KEY && !ACCESS_TOKEN) {
        alert("Trailer not available. Please set up your TMDB API credentials in a .env file to enable trailer functionality.");
      } else {
        alert("No trailer available for this movie.");
      }
      console.log("Playing movie:", movie.title);
    }
  };

  const handleWatchlistToggle = async () => {
    if (!currentUser) {
      alert("Please sign in to add movies to your watchlist.");
      return;
    }

    setWatchlistLoading(true);
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(movie.id);
        setIsInWatchlist(false);
      } else {
        await addToWatchlist({
          id: movie.id,
          title: movie.title,
          poster: movie.poster || movie.poster_path,
          backdrop: movie.backdrop || movie.backdrop_path,
          overview: movie.overview,
          genre: movie.genre,
          year: movie.year,
          rating: movie.rating,
          addedAt: new Date().toISOString()
        });
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error);
      alert("Failed to update watchlist. Please try again.");
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: `Check out ${movie.title}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-black rounded-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-3 rounded-full bg-black/70 hover:bg-black/90 transition-colors border border-white/20"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Hero section with backdrop */}
        <div className="relative h-96">
          <img
            src={movie.backdrop || `https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl font-bold text-white mb-4">{movie.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-green-400 font-semibold">
                {movie.rating} Rating
              </span>
              <span className="text-gray-300">{movie.year}</span>
              <span className="text-gray-300">{movie.genre}</span>
            </div>
            <p className="text-white/90 text-lg max-w-2xl line-clamp-3">
              {movie.overview}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-8 pt-6">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              onClick={handlePlay}
              className="netflix-red-button px-8 py-3 text-lg font-semibold"
            >
              <Play className="w-6 h-6 mr-2 fill-current" />
              {trailerKey ? 'Watch Trailer' : (!API_KEY && !ACCESS_TOKEN ? 'Setup Required' : 'No Trailer')}
            </Button>
            
            <Button 
              onClick={handleWatchlistToggle}
              disabled={watchlistLoading}
              variant="outline" 
              className={`p-3 transition-all duration-200 ${
                isInWatchlist 
                  ? 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white' 
                  : 'netflix-red-outline hover:bg-red-600 hover:text-white hover:border-red-600'
              }`}
            >
              {watchlistLoading ? (
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isInWatchlist ? (
                <Bookmark className="w-6 h-6 fill-current" />
              ) : (
                <Plus className="w-6 h-6" />
              )}
            </Button>
            
            <Button 
              onClick={handleShare}
              variant="outline" 
              className="netflix-red-outline p-3"
            >
              <Share2 className="w-6 h-6" />
            </Button>
          </div>

          {/* Trailer Section */}
          {trailerKey && showTrailer && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Trailer</h3>
                <button
                  onClick={() => setShowTrailer(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                  title={`${movie.title} Trailer`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* API Setup Message */}
          {!trailerKey && (!API_KEY && !ACCESS_TOKEN) && (
            <div className="mb-8 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Trailer Functionality Disabled</h3>
              <p className="text-yellow-200/80 mb-3">
                To enable movie trailers, you need to set up your TMDB API credentials.
              </p>
              <div className="text-sm text-yellow-200/60">
                <p>1. Go to <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-200">TMDB API Settings</a></p>
                <p>2. Create a `.env` file in your project root</p>
                <p>3. Add: <code className="bg-yellow-900/50 px-2 py-1 rounded">VITE_TMDB_API_KEY=your_key_here</code></p>
                <p>4. Restart your development server</p>
              </div>
            </div>
          )}

          {/* Cast section */}
          {cast.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Cast</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {cast.map((person) => (
                  <div key={person.id} className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-gray-700">
                      {person.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <p className="text-white text-sm font-medium">{person.name}</p>
                    <p className="text-gray-400 text-xs">{person.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Details</h3>
              <div className="space-y-2 text-gray-300">
                <p><span className="text-gray-400">Release Date:</span> {movie.release_date}</p>
                <p><span className="text-gray-400">Runtime:</span> {movie.runtime || 'N/A'} min</p>
                <p><span className="text-gray-400">Language:</span> {movie.original_language?.toUpperCase() || 'N/A'}</p>
                <p><span className="text-gray-400">Budget:</span> {movie.budget ? `$${(movie.budget / 1000000).toFixed(1)}M` : 'N/A'}</p>
                <p><span className="text-gray-400">Revenue:</span> {movie.revenue ? `$${(movie.revenue / 1000000).toFixed(1)}M` : 'N/A'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genre_ids?.map((genreId) => {
                  const genreMap = {
                    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
                    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
                    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
                    9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
                    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
                  };
                  return (
                    <span
                      key={genreId}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded-full"
                    >
                      {genreMap[genreId] || 'Unknown'}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
