import { Movie } from "../../types/movie";
import { TV } from "../../types/tv";

type initState = {
    favorites: {
        movies: Array<Movie>;
        tv: Array<TV>;
    }

    watchlist: {
        movies: Array<Movie>;
        tv: Array<TV>;
    }
}

const initialState: initState = {
    favorites: {
        movies: [],
        tv: [],
    },
    watchlist: {
        movies: [],
        tv: [],
    }
};