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
}

export interface SearchProps {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}
