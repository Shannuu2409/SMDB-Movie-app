import { useState, useEffect } from "react";
import { HeroCarousel } from "./components/HeroCarousel";
import { MovieGrid } from "./components/MovieGrid";
import { MovieDetailModal } from "./components/MovieDetailModal";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // v3 key
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN; // v4 token (optional)
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

// Debug: Log API credentials (without exposing the actual values)
console.log("Index - API_KEY present:", !!API_KEY);
console.log("Index - ACCESS_TOKEN present:", !!ACCESS_TOKEN);
console.log("Index - TMDB_BASE_URL:", TMDB_BASE_URL);

const genreMap = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

const Index = ({ searchQuery: initialSearchQuery = "" }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [heroMovies, setHeroMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update search query when prop changes
  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  const fetchTMDB = async (path, params = {}) => {
    const query = new URLSearchParams(params);
    const url = `${TMDB_BASE_URL}${path}?${query.toString()}`;
    console.log("Index fetchTMDB URL:", url);
    
    if (ACCESS_TOKEN) {
      console.log("Index using ACCESS_TOKEN");
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });
      console.log("Index API response status:", res.status);
      return res;
    }
    
    console.log("Index using API_KEY");
    const urlWithKey = `${TMDB_BASE_URL}${path}?${new URLSearchParams({ ...params, api_key: API_KEY }).toString()}`;
    const res = await fetch(urlWithKey);
    console.log("Index API response status:", res.status);
    return res;
  };

  // Fetch initial movie lists on component mount
  useEffect(() => {
    if (!API_KEY && !ACCESS_TOKEN) return;
    const fetchMovies = async () => {
      try {
        const [trendingRes, newRes, topRes, latestRes] = await Promise.all([
          fetchTMDB(`/trending/movie/week`),
          fetchTMDB(`/movie/upcoming`),
          fetchTMDB(`/movie/top_rated`),
          fetchTMDB(`/movie/now_playing`),
        ]);

        if (!trendingRes.ok || !newRes.ok || !topRes.ok || !latestRes.ok) {
          const details = await Promise.allSettled([trendingRes.json(), newRes.json(), topRes.json(), latestRes.json()]);
          const msg = details.map(d => d.status === 'fulfilled' && (d.value.status_message || d.value.errors?.[0])).filter(Boolean)[0];
          setErrorMessage(msg || 'Failed to load movies. Check your API credentials.');
          return;
        }

        const [trendingData, newData, topData, latestData] = await Promise.all([
          trendingRes.json(),
          newRes.json(),
          topRes.json(),
          latestRes.json(),
        ]);

        const processMovies = (data, genre) => 
          (data.results || []).map(movie => ({
            ...movie,
            poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750',
            backdrop: movie.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path}` : 'https://via.placeholder.com/500x750',
            genre: genre,
            year: movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A",
            rating: movie.vote_average.toFixed(1),
          }));

        // Set hero movies (latest + trending for carousel)
        const heroMoviesData = [...(latestData.results || []), ...(trendingData.results || [])].slice(0, 10);
        setHeroMovies(processMovies({ results: heroMoviesData }, "Latest"));

        setTrendingMovies(processMovies(trendingData, "Trending"));
        setNewReleases(processMovies(newData, "New Release"));
        setTopRated(processMovies(topData, "Top Rated"));
        setLatestMovies(processMovies(latestData, "Latest"));
      } catch (error) {
        console.error("Failed to fetch initial movies:", error);
        setErrorMessage('Failed to load movies. See console for details.');
      }
    };

    fetchMovies();
  }, []);

  // Fetch search results when the search query changes
  useEffect(() => {
    if (!API_KEY && !ACCESS_TOKEN) return;
    const searchMovies = async () => {
      if (searchQuery) {
        try {
          console.log("Searching for:", searchQuery);
          const response = await fetchTMDB(`/search/movie`, { query: encodeURIComponent(searchQuery) });
          console.log("Search response status:", response.status);
          if (!response.ok) {
            const data = await response.json();
            setErrorMessage(data.status_message || data.errors?.[0] || 'Search failed.');
            return;
          }
          const data = await response.json();
          console.log("Raw search results:", data.results);
          const mappedResults = (data.results || []).map(movie => ({
            ...movie,
            id: movie.id, // Ensure ID is explicitly preserved
            poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750',
            backdrop: movie.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path}` : 'https://via.placeholder.com/500x750',
            genre: movie.genre_ids && movie.genre_ids.length > 0 ? genreMap[movie.genre_ids[0]] : "Unknown",
            year: movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A",
            rating: movie.vote_average.toFixed(1),
          }));
          console.log("Mapped search results:", mappedResults);
          setSearchResults(mappedResults);
          setErrorMessage("");
        } catch (error) {
          console.error("Failed to search movies:", error);
          setErrorMessage('Search failed. See console for details.');
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounceSearch = setTimeout(() => {
      searchMovies();
    }, 500);

    return () => clearTimeout(debounceSearch);
  }, [searchQuery]);

  const handleShowMovieDetails = (movie) => {
    console.log("Movie clicked from search results:", movie);
    console.log("Movie ID:", movie.id);
    console.log("Movie title:", movie.title);
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen bg-black">
      <main className="pt-16">
        {!API_KEY && !ACCESS_TOKEN && (
          <div className="container mx-auto px-6 py-8">
            <div className="rounded-md border border-border bg-card p-4 text-foreground">
              Add your TMDB API credentials in a .env file, then restart the dev server:
              <div className="mt-2 font-mono text-sm">VITE_TMDB_API_KEY=&lt;v3_key&gt;  or  VITE_TMDB_ACCESS_TOKEN=&lt;v4_bearer_token&gt;</div>
            </div>
          </div>
        )}
        
        {!!errorMessage && (
          <div className="container mx-auto px-6">
            <div className="my-4 rounded-md border border-border bg-card p-3 text-foreground">
              {errorMessage}
            </div>
          </div>
        )}
        
        {!searchQuery && heroMovies.length > 0 && (
          <HeroCarousel 
            movies={heroMovies} 
            onShowDetails={handleShowMovieDetails}
          />
        )}
        
        {searchQuery ? (
          <MovieGrid
            title={`Search Results for "${searchQuery}"`}
            filteredMovies={searchResults}
            onShowDetails={handleShowMovieDetails}
          />
        ) : (
          <>
            <MovieGrid 
              title="Latest Movies" 
              filteredMovies={latestMovies} 
              onShowDetails={handleShowMovieDetails}
            />
            <MovieGrid 
              title="Trending Now" 
              filteredMovies={trendingMovies} 
              onShowDetails={handleShowMovieDetails}
            />
            <MovieGrid 
              title="New Releases" 
              filteredMovies={newReleases} 
              onShowDetails={handleShowMovieDetails}
            />
            <MovieGrid 
              title="Top Rated" 
              filteredMovies={topRated} 
              onShowDetails={handleShowMovieDetails}
            />
          </>
        )}
      </main>

      {/* Movie Detail Modal */}
      <MovieDetailModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;


