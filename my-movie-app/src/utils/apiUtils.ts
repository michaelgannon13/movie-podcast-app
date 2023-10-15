import { Movie } from "../types";

export async function fetchMovie(searchTerm: string, apiKey: string): Promise<Movie> {
    try {
      const response = await fetch(`https://www.omdbapi.com/?t=${searchTerm}&apikey=${apiKey}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.statusText}`);
      }
      const data = await response.json();
      if (data.Error === 'Movie not found!') {
        throw new Error('Movie not found');
      }
      return data;
    } catch (error: any) {
      throw new Error(`Error fetching movie: ${error.message}`);
    }
  }
  
  export async function fetchTmdbId(movieTitle: string, apiKeyRecommend: string): Promise<number | null> {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKeyRecommend}&query=${encodeURIComponent(movieTitle)}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const tmdbId = data.results[0].id;
        return tmdbId;
      } else {
        return null;
      }
    } catch (error: any) {
      throw new Error(`Error fetching TMDB ID: ${error.message}`);
    }
  }
  
  export async function fetchRecommendation(tmdbId: number, apiKeyRecommend: string): Promise<string> {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbId}/similar?api_key=${apiKeyRecommend}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].title;
      } else {
        return 'No recommendations available';
      }
    } catch (error: any) {
      throw new Error(`Error fetching recommendations: ${error.message}`);
    }
  }
  