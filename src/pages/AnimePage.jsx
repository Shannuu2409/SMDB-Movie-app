import { useState, useEffect } from "react";
import { MovieGrid } from "../components/MovieGrid";
import { MovieDetailModal } from "../components/MovieDetailModal";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

const AnimePage = () => {
  const [animeMovies, setAnimeMovies] = useState([]);
  const [animeTV, setAnimeTV] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
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
    const fetchAnime = async () => {
      if (!API_KEY && !ACCESS_TOKEN) return;
      
      try {
        const [animeMoviesRes, animeTVRes] = await Promise.all([
          fetchTMDB('/discover/movie', { with_genres: 16, sort_by: 'popularity.desc' }),
          fetchTMDB('/discover/tv', { with_genres: 16, sort_by: 'popularity.desc' }),
        ]);

        const [animeMoviesData, animeTVData] = await Promise.all([
          animeMoviesRes.json(),
          animeTVRes.json(),
        ]);

        const processAnime = (data, type) => 
          (data.results || []).map(item => ({
            ...item,
            poster: item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/500x750',
            backdrop: item.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${item.backdrop_path}` : 'https://via.placeholder.com/500x750',
            genre: "Anime",
            year: item.release_date || item.first_air_date ? new Date(item.release_date || item.first_air_date).getFullYear() : "N/A",
            rating: item.vote_average.toFixed(1),
            title: item.title || item.name,
            overview: item.overview,
            type: type,
          }));

        setAnimeMovies(processAnime(animeMoviesData, "Movie"));
        setAnimeTV(processAnime(animeTVData, "TV Series"));
      } catch (error) {
        console.error("Failed to fetch anime:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnime();
  }, []);

  const handleShowDetails = (anime) => {
    setSelectedAnime(anime);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAnime(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading anime...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-8">Anime</h1>
          
          <MovieGrid 
            title="Anime Movies" 
            filteredMovies={animeMovies} 
            onShowDetails={handleShowDetails}
          />
          
          <MovieGrid 
            title="Anime TV Series" 
            filteredMovies={animeTV} 
            onShowDetails={handleShowDetails}
          />
        </div>
      </div>

      <MovieDetailModal
        movie={selectedAnime}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default AnimePage;
