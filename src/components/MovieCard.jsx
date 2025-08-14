import { useState } from "react";

export const MovieCard = ({ movie, onShowDetails }) => {
  const handleCardClick = () => {
    onShowDetails?.(movie);
  };

  return (
    <div
      className="relative group cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
      onClick={handleCardClick}
    >
      {/* Movie Poster */}
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Movie Info */}
      <div className="mt-3">
        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{movie.year}</span>
          <span className="flex items-center">
            <span className="text-yellow-400 mr-1">★</span>
            {movie.rating}
          </span>
        </div>
        <div className="mt-2">
          <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded-full">
            {movie.genre}
          </span>
        </div>
      </div>
    </div>
  );
};


