import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);

  const apiKey = process.env.REACT_APP_OMDB_API_KEY;


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = async () => {
    if (searchTerm) {
      try {
        const response = await fetch(`https://www.omdbapi.com/?t=${searchTerm}&apikey=${apiKey}`);
        if (!response.ok) {
          throw new Error(`Network response was not ok ${response.statusText}`);
        }
        const data = await response.json();
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
        </div>
      </header>
    </div>
  );
}

export default App;
