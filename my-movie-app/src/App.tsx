/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import './App.css';
import Nav from './components/nav/Nav';
import { Movie } from './types';
import MovieRecommendation from './components/movies/recommendation/MovieRecommendation';
import MovieCard from './components/movies/card/MovieCard';
import ErrorModal from './components/error/Modal';


function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie>();
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const apiKeyRecommend = process.env.REACT_APP_TMDB_API_KEY;

  // Check local storage for movies
  const savedMoviesJSON = localStorage.getItem('movieList');
  const savedMovies = savedMoviesJSON ? JSON.parse(savedMoviesJSON) : [];
  const [movieList, setMovieList] = useState(savedMovies);
  const [errorMsg, setErrorMsg] = useState(false);
  const apiKey = process.env.REACT_APP_OMDB_API_KEY;
  const MovieList = React.lazy(() => import('./components/movies/list/MovieList'));
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    if (movieList.length > 0) {
      // Get the title of the last movie added to the list
      const movieTitle = movieList[movieList.length - 1].Title;
      fetchTmdbId(movieTitle);
    }
  }, [movieList]);
  

  const fetchMovie = async (searchTerm: string, apiKey: string) => {
    const response = await fetch(`https://www.omdbapi.com/?t=${searchTerm}&apikey=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.statusText}`);
    }
    const data = await response.json();
    if (data.Error === 'Movie not found!') {
      setErrorMsg(true);
    }
    return data;
  };

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


  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);


  const handleClearList = useCallback(() => {
      setErrorMsg(false);
      setMovieList([]);
      localStorage.removeItem('movieList');
  }, []);

  const handleAddToList = useCallback((movie: Movie) => {
    const isDuplicate = movieList.some(
        (existingMovie: { Title: string }) => existingMovie.Title === movie.Title
    );

    if (isDuplicate) {
        setModalMessage('This movie already exists in your list');
        setShowErrorModal(true);
        return;
    }

    if (movieList.length < 10) {
        const updatedMovieList = [...movieList, movie];
        setMovieList(updatedMovieList);
        localStorage.setItem('movieList', JSON.stringify(updatedMovieList));
    } else {
      setModalMessage('You can only add 10 movies to your list');
      setShowErrorModal(true);
    }
}, [movieList]);


const handleRemoveMovie = useCallback((movie: Movie) => {
  const updatedMovieList = movieList.filter((m: Movie) => m.Title !== movie.Title);
  setMovieList(updatedMovieList);
  localStorage.setItem('movieList', JSON.stringify(updatedMovieList));
}, [movieList]);


  // Sync movieList state with local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('movieList', JSON.stringify(movieList));
  }, [movieList]);

  const handleSearchClick = useCallback(async () => {
    if (searchTerm !== '' && apiKey) {
        try {
            const data = await fetchMovie(searchTerm, apiKey);
            setMovies(data);
        } catch (error) {
            setError('There has been a problem with your fetch operation: ' + error);
        }
    } else {
        setError('Search term or API key is not defined');
    }
}, [searchTerm, apiKey]);

  return (
    <div className="App">
      <Nav />
      <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <div className="input-group mb-3">
                <label htmlFor="movie-search" className="visually-hidden">Search for movies</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search for movies..." 
                  value={searchTerm}
                  onChange={handleSearchChange}
                  id="movie-search"
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

          <div className='result-container' aria-live="polite">
            {movies?.Title ? (
              <MovieCard movie={movies} customClass="d-flex flex-row mb-4" showDetails={true}>
                <button className="btn btn-primary add-to-list-btn" onClick={() => handleAddToList(movies)}>
                    Add to List
                </button>
              </MovieCard>
              ) : (
                <div className='no-movies'>
                  {
                  errorMsg ? <div className="alert alert-danger" role="alert">Sorry! There are no movies matching your search request!</div> : null}
                </div>
              )}
          </div>
      </div>

      {movieList.length > 0 ? <MovieRecommendation recommendation={recommendation} /> : null}

      <div className="container movie-list-container">
          {/* Lazy loading */}
          <Suspense fallback={<div>Loading Movie List...</div>}>
            <MovieList movieList={movieList} onRemoveMovie={handleRemoveMovie} />
          </Suspense>
      </div>
      <ErrorModal 
          show={showErrorModal} 
          message={modalMessage}
          onHide={() => setShowErrorModal(false)} 
      />
    </div>
  );
}

export default App;
