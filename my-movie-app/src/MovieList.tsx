// MovieList.tsx
import './MovieList.css';
import React from 'react';

// Define a type for individual movie objects
interface Movie {
    Title: string;
    Year: string;
    Plot: string;
    Poster: string;
}

// Define a type for the props that MovieList component will receive
interface MovieListProps {
    movieList: Movie[];
}

function MovieList({ movieList }: MovieListProps) {
    return (
        <div className="movie-list">
            {movieList.map((movie, index) => (
                <div key={index} className="movie-item">
                    <img src={movie.Poster} alt={movie.Title} className="movie-image" />
                </div>
            ))}
        </div>
    );
}

export default MovieList;

export {};

