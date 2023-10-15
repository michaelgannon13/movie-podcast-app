import { Movie } from "../types";

export function getSavedMovies(): Movie[] {
    const savedMoviesJSON = localStorage.getItem('movieList');
    return savedMoviesJSON ? JSON.parse(savedMoviesJSON) : [];
  }
  
  export function saveMovies(movies: Movie[]): void {
    localStorage.setItem('movieList', JSON.stringify(movies));
  }
  
  export function isDuplicateMovie(movieList: Movie[], movie: Movie): boolean {
    return movieList.some((existingMovie) => existingMovie.Title === movie.Title);
  }
  
  export function exceedMovieLimit(movieList: Movie[]): boolean {
    return movieList.length >= 10;
  }
  
  export function showAlert(message: string): void {
    alert(message);
  }
  