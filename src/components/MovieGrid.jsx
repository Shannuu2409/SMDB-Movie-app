import { MovieCard } from "./MovieCard";

export const MovieGrid = ({ title, filteredMovies = [], onShowDetails }) => {
  const handlePlay = (movie) => {
    console.log("Playing movie:", movie.title);
    // TODO: Implement movie player
  };

  const handleShowDetails = (movie) => {
    onShowDetails?.(movie);
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold text-foreground mb-8">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={{
                ...movie,
                title: movie.title || movie.name,
                genre: movie.genre || "N/A",
                year: movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A",
                rating: movie.vote_average.toFixed(1),
                description: movie.overview,
                poster: movie.poster || `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              }} 
              onPlay={handlePlay} 
              onShowDetails={handleShowDetails}
            />
          ))}
        </div>
      </div>
    </section>
  );
};


