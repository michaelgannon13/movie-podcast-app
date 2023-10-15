// MovieList.tsx
import './MovieList.css';
import { useEffect, useState } from 'react';
import { Movie, MovieListProps } from '../../../types';
import MovieCard from '../card/MovieCard';

function MovieList({ movieList, onRemoveMovie }: MovieListProps) {
    const [recommendation, setRecommendation] = useState<string | null>(null);
    const apiKeyRecommend = process.env.REACT_APP_TMDB_API_KEY;

    useEffect(() => {
        if (movieList.length > 0) {
            const movieTitle = movieList[0].Title;  // Assume the first movie's title represents the user's choice
            fetchTmdbId(movieTitle);
        }
    }, [movieList]);

    const fetchTmdbId = async (movieTitle: string) => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=${apiKeyRecommend}&query=${encodeURIComponent(movieTitle)}`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const tmdbId = data.results[0].id;
                fetchRecommendation(tmdbId);
            } else {
                setRecommendation('No recommendations available');
            }
        } catch (error) {
            console.error('Error fetching TMDB ID:', error);
            setRecommendation('No recommendations available');
        }
    };

    const fetchRecommendation = async (tmdbId: number) => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${tmdbId}/similar?api_key=${apiKeyRecommend}`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                setRecommendation(data.results[0].title);
            } else {
                setRecommendation('No recommendations available');
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setRecommendation('No recommendations available');
        }
    };


    return (
        <div className="movie-list">
            {movieList.map((movie, index) => (
                <div key={index} className="movie-item">
                    <div className="movie-list-card">
                        <MovieCard movie={movie} />
                    </div>
                    <button type="button" className="btn btn-danger" onClick={() => onRemoveMovie(movie)}>Remove</button>
                </div>
            ))}
      </div>
    );
}

export default MovieList;
