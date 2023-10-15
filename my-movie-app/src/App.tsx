import React, { Suspense, useEffect, useState } from 'react';
import './App.css';
import Nav from './components/nav/Nav';
import { Movie } from './types';
import MovieRecommendation from './components/movies/recommendation/MovieRecommendation';
import MovieCard from './components/movies/card/MovieCard';

import {
  fetchMovie,
  fetchTmdbId,
  fetchRecommendation,
} from './utils/apiUtils';

import {
  getSavedMovies,
  saveMovies,
  isDuplicateMovie,
  exceedMovieLimit,
  showAlert,
} from './utils/helperFunctions';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const apiKeyRecommend = process.env.REACT_APP_TMDB_API_KEY || '';

  // Check local storage for movies
  const savedMovies = getSavedMovies();
  const [movieList, setMovieList] = useState<Movie[]>(savedMovies);
  const [errorMsg, setErrorMsg] = useState(false);
  const apiKey = process.env.REACT_APP_OMDB_API_KEY || '';
  const MovieList = React.lazy(() => import('./components/movies/list/MovieList'));

  useEffect(() => {
    if (movieList.length > 0) {
      // Get the title of the last movie added to the list
      const movieTitle = movieList[movieList.length - 1].Title;
      fetchTmdbId(movieTitle, apiKeyRecommend);
    }
  }, [movieList]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearList = () => {
    setMovieList([]);
    localStorage.removeItem('movieList');
  };

  const handleAddToList = (movie: Movie) => {
    if (isDuplicateMovie(movieList, movie)) {
      showAlert('This movie is already in your list');
      return;
    }

    if (exceedMovieLimit(movieList)) {
      showAlert('You can only add 10 movies to your list');
      return;
    }

    const updatedMovieList = [...movieList, movie];
    setMovieList(updatedMovieList);
    saveMovies(updatedMovieList);
  };

  const handleRemoveMovie = (movie: Movie) => {
    const updatedMovieList = movieList.filter((m: Movie) => m.Title !== movie.Title);
    setMovieList(updatedMovieList);
    saveMovies(updatedMovieList);
  };

  useEffect(() => {
    localStorage.setItem('movieList', JSON.stringify(movieList));
  }, [movieList]);

  const handleSearchClick = async () => {
    if (searchTerm !== '') {
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
    }
  };

  return (
    <div className="App">
      <Nav />
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
            </div>
            <div className="input-group-append">
              <button 
                className="btn btn-primary me-2" 
                type="button"
                onClick={handleSearchClick}
              >
                Search
              </button>
              <button 
                className="btn btn-danger me-2" 
                type="button"
                onClick={handleClearList}
              >
                Clear List
              </button>
            </div>
          </div>
        </div>

        <div className='result-container'>
          {movies?.Title ? (
            <MovieCard movie={movies} customClass="d-flex flex-row mb-4" showDetails={true}>
              <button className="btn btn-primary add-to-list-btn" onClick={() => handleAddToList(movies)}>
                Add to List
              </button>
            </MovieCard>
          ) : (
            <div className="no-movies">
              {errorMsg ? <div className="no-movies">Sorry! There are no movies matching your search request!</div> : null}
            </div>
          )}
        </div>
      </div>

      {movieList.length > 0 ? <MovieRecommendation recommendation={fetchRecommendation(1, apiKeyRecommend)} /> : null}

      <div className="container movie-list-container">
        <Suspense fallback={<div>Loading Movie List...</div>}>
          <MovieList movieList={movieList} onRemoveMovie={handleRemoveMovie} />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
