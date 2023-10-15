export interface Movie {
    id: number;
    Title: string;
    Year: string;
    Plot: string;
    Poster: string;
    Genre: string;
    Released: string;
}

export interface MovieListProps {
    movieList: Movie[];
    onRemoveMovie: (movie: Movie) => void;
}

export interface MovieCardProps {
    movie: {
        Title: string,
        Year: string,
        Released: string,
        Plot: string,
        Poster: string,
      },
      customClass?: string,
      children?: React.ReactNode,
      showDetails?: boolean,
}

export interface SearchProps {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}
