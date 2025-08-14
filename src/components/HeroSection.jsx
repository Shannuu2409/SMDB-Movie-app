import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Info, Volume2, VolumeX } from "lucide-react";

export const HeroSection = ({ movie, onShowDetails }) => {
  if (!movie) {
    return null;
  }

  const title = movie.title || "Movie Title";
  const description = movie.overview || "No description available.";
  const genre = movie.genre || "Genre";
  const year = movie.year || "N/A";
  const rating = movie.rating || "N/A";
  const backdrop = movie.backdrop || 'https://via.placeholder.com/1920x1080';

  const handlePlay = () => {
    console.log("Playing movie:", movie.title);
    // TODO: Implement movie player functionality
  };

  const handleMoreInfo = () => {
    onShowDetails?.(movie);
  };

  return (
    <section className="relative h-[80vh] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={backdrop}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 netflix-gradient" />
      </div>
      
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            <div className="flex gap-3 mb-4">
              <Badge variant="secondary" className="bg-green-500 text-black border-0 font-semibold">
                {rating} Rating
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white bg-black/20">
                {year}
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white bg-black/20">
                {genre}
              </Badge>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 leading-tight">
              {title}
            </h1>
            
            <p className="text-white/90 text-lg mb-6 max-w-xl line-clamp-3">
              {description}
            </p>
            
            <div className="flex gap-4">
              <Button 
                onClick={handlePlay} 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold transition-all duration-200"
              >
                <Play className="w-6 h-6 mr-2 fill-current" />
                Play
              </Button>
              <Button 
                onClick={handleMoreInfo}
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white hover:text-black px-8 py-3 text-lg font-semibold transition-all duration-200"
              >
                <Info className="w-6 h-6 mr-2" />
                More Info
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


