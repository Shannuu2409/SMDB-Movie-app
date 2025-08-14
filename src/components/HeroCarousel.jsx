import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroCarousel = ({ movies = [], onShowDetails }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || movies.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, movies.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const handleMoreInfo = (movie) => {
    onShowDetails?.(movie);
  };

  if (!movies.length) return null;

  const currentMovie = movies[currentIndex];

  return (
    <section className="relative h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentMovie.backdrop || `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
          alt={currentMovie.title}
          className="w-full h-full object-cover transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/80" />
      </div>
      
      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors border border-white/20"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors border border-white/20"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            <div className="flex gap-3 mb-4">
              <span className="bg-green-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                {currentMovie.rating} Rating
              </span>
              <span className="border border-white/30 text-white bg-black/20 px-3 py-1 rounded-full text-sm">
                {currentMovie.year}
              </span>
              <span className="border border-white/30 text-white bg-black/20 px-3 py-1 rounded-full text-sm">
                {currentMovie.genre}
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 leading-tight">
              {currentMovie.title}
            </h1>
            
            <p className="text-white/90 text-lg mb-6 max-w-xl line-clamp-3">
              {currentMovie.overview}
            </p>
            
            <div className="flex gap-4">
              <Button 
                onClick={() => handleMoreInfo(currentMovie)}
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold transition-all duration-200"
              >
                <Info className="w-6 h-6 mr-2" />
                More Info
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex space-x-2">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
