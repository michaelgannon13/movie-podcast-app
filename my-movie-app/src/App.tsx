import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MovieList from './MovieList';
import { Movie } from './types';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie>();
  const [error, setError] = useState<string | null>(null);

  // Check local storage for movies
  const savedMoviesJSON = localStorage.getItem('movieList');
  const savedMovies = savedMoviesJSON ? JSON.parse(savedMoviesJSON) : [];
  const [movieList, setMovieList] = useState(savedMovies);
  const [fadeIn, setFadeIn] = useState(false);

  const apiKey = process.env.REACT_APP_OMDB_API_KEY;

  const fetchMovie = async (searchTerm: string, apiKey: string) => {
    const response = await fetch(`https://www.omdbapi.com/?t=${searchTerm}&apikey=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddToList = (movie: Movie) => {
    if (movieList.length < 10) {
      const updatedMovieList = [...movieList, movie];
      setMovieList(updatedMovieList);
      localStorage.setItem('movieList', JSON.stringify(updatedMovieList));
    } else {
      alert('You can only add 10 movies to your list')
    }
  };

  // Sync movieList state with local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('movieList', JSON.stringify(movieList));
  }, [movieList]);

  useEffect(() => {
    if (movies) {
      setFadeIn(true);  /* Trigger fade-in */
    }
  }, [movies]);

  const handleSearchClick = async () => {

      if (apiKey) { 
        try {
          const data = await fetchMovie(searchTerm, apiKey);
          setMovies(data);
        } catch (error) {
          setError('There has been a problem with your fetch operation: ' + error);
        }
      } else {
        setError('API key is not defined');
      }
    setFadeIn(true);
  };

  return (
    <div className="App">
      <header className="App-header">
      </header>

      <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <div className="input-group mb-3">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search for movies..." 
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <div className="input-group-append">
                  <button 
                    className="btn btn-primary" 
                    type="button"
                    onClick={handleSearchClick}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>


          <div className={`result-container ${fadeIn ? 'fade-in' : ''}`}>

              {movies?.Title ? (
                    <div className="movie-card d-flex flex-row mb-4">
                    <div className="movie-image flex-shrink-0 m-3">
                        <img src={movies.Poster} alt={movies.Title} className="img-fluid" />
                    </div>
                    <div className="card-body d-flex flex-column justify-content-center">
                        <h2 className="card-title mb-2">{movies.Title}</h2>
                        <p className="card-text mb-2">
                            <strong>Release Year:</strong> {movies.Year}<br />
                            <strong>Release Date:</strong> {movies.Released}<br />
                            <strong>Plot:</strong> {movies.Plot !== "N/A" ? movies.Plot : "No plot available"}
                        </p>
                        <button className="result-btn btn btn-primary" onClick={() => handleAddToList(movies)}>
                            Add to List
                        </button>
                    </div>
                </div>
                
                ) : (
                  <div className="no-movies">
                    <div>
                      Sorry! There are no movies matching your search request!
                    </div>
                  </div>
                )}
              </div>
        </div>
        <div className="listContainer">
          <MovieList movieList={movieList} />
        </div>
    </div>
  );
}

export default App;
