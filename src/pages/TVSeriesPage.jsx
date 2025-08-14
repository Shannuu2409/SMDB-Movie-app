import { useState, useEffect } from "react";
import { MovieGrid } from "../components/MovieGrid";
import { MovieDetailModal } from "../components/MovieDetailModal";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

const TVSeriesPage = () => {
  const [trendingTV, setTrendingTV] = useState([]);
  const [dramaTV, setDramaTV] = useState([]);
  const [comedyTV, setComedyTV] = useState([]);
  const [crimeTV, setCrimeTV] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
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
    const fetchTVShows = async () => {
      if (!API_KEY && !ACCESS_TOKEN) return;
      
      try {
        const [trendingRes, dramaRes, comedyRes, crimeRes] = await Promise.all([
          fetchTMDB('/trending/tv/week'),
          fetchTMDB('/discover/tv', { with_genres: 18, sort_by: 'popularity.desc' }),
          fetchTMDB('/discover/tv', { with_genres: 35, sort_by: 'popularity.desc' }),
          fetchTMDB('/discover/tv', { with_genres: 80, sort_by: 'popularity.desc' }),
        ]);

        const [trendingData, dramaData, comedyData, crimeData] = await Promise.all([
          trendingRes.json(),
          dramaRes.json(),
          comedyRes.json(),
          crimeRes.json(),
        ]);

        const processTVShows = (data, genre) => 
          (data.results || []).map(show => ({
            ...show,
            poster: show.poster_path ? `${TMDB_IMAGE_BASE_URL}${show.poster_path}` : 'https://via.placeholder.com/500x750',
            backdrop: show.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${show.backdrop_path}` : 'https://via.placeholder.com/500x750',
            genre: genre,
            year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : "N/A",
            rating: show.vote_average.toFixed(1),
            title: show.name,
            overview: show.overview,
          }));

        setTrendingTV(processTVShows(trendingData, "Trending"));
        setDramaTV(processTVShows(dramaData, "Drama"));
        setComedyTV(processTVShows(comedyData, "Comedy"));
        setCrimeTV(processTVShows(crimeData, "Crime"));
      } catch (error) {
        console.error("Failed to fetch TV shows:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTVShows();
  }, []);

  const handleShowDetails = (show) => {
    setSelectedShow(show);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedShow(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading TV shows...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-8">TV Series</h1>
          
          <MovieGrid 
            title="Trending TV Shows" 
            filteredMovies={trendingTV} 
            onShowDetails={handleShowDetails}
          />
          
          <MovieGrid 
            title="Drama Series" 
            filteredMovies={dramaTV} 
            onShowDetails={handleShowDetails}
          />
          
          <MovieGrid 
            title="Comedy Series" 
            filteredMovies={comedyTV} 
            onShowDetails={handleShowDetails}
          />
          
          <MovieGrid 
            title="Crime Series" 
            filteredMovies={crimeTV} 
            onShowDetails={handleShowDetails}
          />
        </div>
      </div>

      <MovieDetailModal
        movie={selectedShow}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default TVSeriesPage;
