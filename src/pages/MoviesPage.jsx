import { useState, useEffect } from "react";
import { MovieGrid } from "../components/MovieGrid";
import { MovieDetailModal } from "../components/MovieDetailModal";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

const MoviesPage = () => {
  const [actionMovies, setActionMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [dramaMovies, setDramaMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTMDB = async (path, params = {}) => {
    const query = new URLSearchParams(params);
    const url = `${TMDB_BASE_URL}${path}?${query.toString()}`;
    if (ACCESS_TOKEN) {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });
      return res;
    }
    const urlWithKey = `${TMDB_BASE_URL}${path}?${new URLSearchParams({ ...params, api_key: API_KEY }).toString()}`;
    return fetch(urlWithKey);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      if (!API_KEY && !ACCESS_TOKEN) return;
      
      try {
        const [actionRes, comedyRes, dramaRes, horrorRes] = await Promise.all([
          fetchTMDB('/discover/movie', { with_genres: 28, sort_by: 'popularity.desc' }),
          fetchTMDB('/discover/movie', { with_genres: 35, sort_by: 'popularity.desc' }),
          fetchTMDB('/discover/movie', { with_genres: 18, sort_by: 'popularity.desc' }),
          fetchTMDB('/discover/movie', { with_genres: 27, sort_by: 'popularity.desc' }),
        ]);

        const [actionData, comedyData, dramaData, horrorData] = await Promise.all([
          actionRes.json(),
          comedyRes.json(),
          dramaRes.json(),
          horrorRes.json(),
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

        setActionMovies(processMovies(actionData, "Action"));
        setComedyMovies(processMovies(comedyData, "Comedy"));
        setDramaMovies(processMovies(dramaData, "Drama"));
        setHorrorMovies(processMovies(horrorData, "Horror"));
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleShowMovieDetails = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading movies...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-8">Movies</h1>
          
          <MovieGrid 
            title="Action Movies" 
            filteredMovies={actionMovies} 
            onShowDetails={handleShowMovieDetails}
          />
          
          <MovieGrid 
            title="Comedy Movies" 
            filteredMovies={comedyMovies} 
            onShowDetails={handleShowMovieDetails}
          />
          
          <MovieGrid 
            title="Drama Movies" 
            filteredMovies={dramaMovies} 
            onShowDetails={handleShowMovieDetails}
          />
          
          <MovieGrid 
            title="Horror Movies" 
            filteredMovies={horrorMovies} 
            onShowDetails={handleShowMovieDetails}
          />
        </div>
      </div>

      <MovieDetailModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default MoviesPage;
