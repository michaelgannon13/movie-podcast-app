import './MovieList.css';
import { MovieListProps } from '../../../types';
import MovieCard from '../card/MovieCard';

function MovieList({ movieList, onRemoveMovie }: MovieListProps) {

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
