import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie>();
  const apiKey = process.env.REACT_APP_OMDB_API_KEY;

  interface Movie {
    Title: string;
    Year: string;
    Released: string;
    Plot: string;
    Poster: string;
  }


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddToList = (movie: Movie) => {
  };

  const handleSearchClick = async () => {

    if (searchTerm !== '') {
      try {
        const response = await fetch(`https://www.omdbapi.com/?t=${searchTerm}&apikey=${apiKey}`);
        if (!response.ok) {
          throw new Error(`Network response was not ok ${response.statusText}`);
        }
        const data = await response.json();
        console.log('data ', data)
        setMovies(data);
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    }
  };
  

  return (
    <div className="App">
      <header className="App-header">
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
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={handleSearchClick}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div>

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
                    <button className="btn btn-primary" onClick={() => handleAddToList(movies)}>
                        Add to List
                    </button>
                </div>
            </div>
            ) : (
              <div className="no-movies">
                Sorry! There are no movies matching your search request!
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
