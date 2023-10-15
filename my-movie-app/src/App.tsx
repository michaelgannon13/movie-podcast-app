/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import './App.css';
import MovieList from './components/movies/list/MovieList';
import Nav from './components/nav/Nav';
import { Movie } from './types';
import MovieRecommendation from './components/movies/recommendation/MovieRecommendation';

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
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={handleSearchClick}
                  >
                    Search
                  </button>
                </div>
            </div>
          </div>

          <div className='result-container'>
            {movies?.Title ? (
                  <div className="movie-card d-flex flex-row mb-4">
                  <div className="movie-image flex-shrink-0 m-3">
                      <img src={movies.Poster} alt={movies.Title} className="img-fluid" />
                  </div>
                  <div className="card-body d-flex flex-column justify-content-center">
                      <h5 className="card-title mb-2">{movies.Title}</h5>
                      <p className="card-text mb-2">
                          <strong>Release Year:</strong> {movies.Year}<br />
                          <strong>Release Date:</strong> {movies.Released}<br />
                          <strong>Plot:</strong> {movies.Plot !== "N/A" ? movies.Plot : "No plot available"}
                      </p>
                      <button className="btn btn-primary add-to-list-btn" onClick={() => handleAddToList(movies)}>
                          Add to List
                      </button>
                  </div>
              </div>
              ) : (
                <div className="no-movies">
                  {errorMsg ? <div className="no-movies">Sorry! There are no movies matching your search request!</div> : null}
                </div>
              )}
          </div>
      </div>

      <div className="container">
        <div className="listContainer">
          <MovieList movieList={movieList} />
          <MovieRecommendation recommendation={recommendation} />
        </div>
      </div>
    </div>
  );
}

export default App;
