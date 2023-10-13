import './MovieList.css';
import { useEffect, useState } from 'react';
import { MovieListProps } from './types';

function MovieList({ movieList }: MovieListProps) {

    const [highestGenre, setHighestGenre] = useState({ genre: '', count: 0 });

    useEffect(() => {
        const genreCount: { [key: string]: number } = {};
    
        movieList.forEach(movie => {
          movie.Genre.split(", ").forEach(genre => {
            genreCount[genre] = (genreCount[genre] || 0) + 1;
          });
        });
    
        const maxGenre = Object.keys(genreCount).reduce((a, b) => genreCount[a] > genreCount[b] ? a : b, '');
        
        setHighestGenre({ genre: maxGenre, count: genreCount[maxGenre] });
    
      }, [movieList]);

    function getRecommendations(genre: string) {
        const recommendations: { [key: string]: string } = {
            Crime: 'The Godfather',
            Romance: 'The Notebook',
            Action: 'The Dark Knight',
            Drama: 'Forrest Gump',
            Comedy: 'Dumb and Dumber',
            Thriller: 'Se7en',
            Horror: 'The Shining',
            Adventure: 'Indiana Jones and the Last Crusade',
            SciFi: 'Interstellar',
            Mystery: 'The Girl with the Dragon Tattoo',
            Fantasy: 'The Lord of the Rings: The Fellowship of the Ring',
            Animation: 'Toy Story',
            Family: 'The Lion King',
            Musical: 'The Sound of Music',
            War: 'Saving Private Ryan',
            Western: 'The Good, The Bad and The Ugly',
            Biography: 'The Social Network',
            History: 'Schindlers List',
            Sport: 'Rocky',
            Music: 'Whiplash',
            Documentary: 'Blackfish',
            Superhero: 'Avengers: Endgame',
            Noir: 'Chinatown'
        };
        
        return recommendations[genre as keyof typeof recommendations] || 'No recommendations available';
    }

    return (
        <div className="movie-list">
            {movieList.map((movie, index) => (
                <div key={index} className="movie-item">
                    <img src={movie.Poster} alt={movie.Title} className="movie-image" />
                </div>
            ))}

            <div className="genre-recommendation">
                {highestGenre.count > 0 && (
                    <div>
                        <p>
                            You have selected {highestGenre.count} movie{highestGenre.count > 1 ? 's' : ''} 
                            with the genre, {highestGenre.genre}. Because you like them, you might like these...
                        </p>
                        <p>Recommended Movie: {getRecommendations(highestGenre.genre)}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MovieList;

export {};

