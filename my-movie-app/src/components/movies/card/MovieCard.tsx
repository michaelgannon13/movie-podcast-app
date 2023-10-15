import React from 'react';
import { MovieCardProps } from '../../../types';

const MovieCard: React.FC<MovieCardProps> = ({ movie, customClass, showDetails, children }) => {
    if (!movie) {
        return null;
      }

    return (
      <div className={`movie-card ${customClass}`}>
        <div className="movie-image">
        <img src={movie.Poster} alt={movie.Title} />
      </div>
        {showDetails && (
          <div className="card-body d-flex flex-column justify-content-center">
            <h5 className="card-title mb-2">{movie.Title}</h5>
            {showDetails && (
                <>
                    <p className="card-text mb-2">
                    <strong>Release Year:</strong> {movie.Year}<br />
                    <strong>Release Date:</strong> {movie.Released}<br />
                    <strong>Plot:</strong> {movie.Plot !== "N/A" ? movie.Plot : "No plot available"}
                    </p>
                </>
            )}


            {children}
          </div>
        )}
        {!showDetails && (
          <div className="card-body d-flex flex-column justify-content-center">
            <h5 className="card-title mb-2">{movie.Title}</h5>
            {children}
          </div>
        )}
      </div>
    );
  };

export default MovieCard;