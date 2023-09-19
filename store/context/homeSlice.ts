import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { animeX, genre, hindi, trending, movie, tv, anilist } from "../../utils/constants";
import { Media } from "../../types/media";
import { TV } from "../../types/tv";
import { Movie } from "../../types/movie";
import { Anime } from "../../types/anime";
import { AniList } from "../../types/anilist";

type initState = {
    name: string;
    data: any[];
    trending: {
        movies: Array<Movie>;
        tv: Array<TV>;
        all: Array<Media>;
        anime: Array<AniList>;
        bollywood: Array<Movie>;
    },
    discover: {
        movies: Array<Movie>;
        tv: Array<TV>;
        all: Array<Media>;
        anime: Array<AniList>;
    },
    movies: {
        popular: Array<Movie>;
        topRated: Array<Movie>;
        genres: Array<{
            id: number;
            name: string;
            results: Array<Movie>;
        }>;
        lastRefreshed: number;
    },
    tv: {
        popular: Array<TV>;
        topRated: Array<TV>;
        genres: Array<{
            id: number;
            name: string;
            results: Array<TV>;
        }>;
        lastRefreshed: number;
    },
    lastRefreshed: number;
    genre: {
        id: number;
        name: string;
    }[];
}

const initialState: initState = {
    name: "Home",
    data: [],
    trending: {
        movies: [],
        tv: [],
        all: [],
        anime: [],
        bollywood: [],
    },
    discover: {
        movies: [],
        tv: [],
        all: [],
        anime: [],
    },
    movies: {
        popular: [],
        topRated: [],
        genres: [],
        lastRefreshed: 0,
    },
    tv: {
        popular: [],
        topRated: [],
        genres: [],
        lastRefreshed: 0,
    },

    lastRefreshed: 0,
    genre: [],
};

export const fetchTrending = createAsyncThunk("home/fetchTrending", async () => {
    try {
        const all = fetch(trending.all);
        const movies = fetch(trending.today.movies);
        const tv = fetch(trending.today.tv);
        const anime = fetch(anilist.trending(1));
        const bollywood = fetch(hindi.recentMovie(1));
        const data = await Promise.allSettled([all, movies, tv, bollywood, anime]);

        

        const res = await Promise.all(data.map((res) => {
            if (res.status === "fulfilled" && res.value.ok) {
                return res.value.json();
            }
            return null;
        }));
        return {
            all: res[0].results,
            movies: res[1].results,
            tv: res[2].results,
            bollywood: res[3].results.map((movie: any) => ({ ...movie, media_type: "movie" })),
            anime: res[4]?.results.map((anime: any) => ({ ...anime, media_type: "anime" })),
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
});

export const fetchGenre = createAsyncThunk("home/fetchGenre", async () => {
    try {
        const res = await fetch(genre.list);
        const data = await res.json();
        return data.genres;
    } catch (error) {
        console.log(error);
        throw error;
    }
});

export const fetchMovies = createAsyncThunk("home/fetchMovies", async (page: number) => {
    try {
        const genresList = await (await fetch(genre.listMovie)).json() as {
            genres: { id: number, name: string }[]
        }

        const popular = fetch(movie.popular(page));
        const topRated = fetch(movie.topRated(page));

        const genresData = genresList.genres.map(async (_genre) => {
            const res = fetch(genre.movie(_genre.id, page));
            return res
        });

        const data = await Promise.all([popular, topRated, ...genresData]);
        const res = await Promise.all(data.map((res) => res.json()));

        return {
            popular: res[0].results.map((movie: any) => ({ ...movie, media_type: "movie" })),
            topRated: res[1].results.map((movie: any) => ({ ...movie, media_type: "movie" })),
            genres: res.slice(2).map((genre, i) => ({
                results: genre.results.map((movie: any) => ({ ...movie, media_type: "movie" })),
                id: genresList.genres[i].id, name: genresList.genres[i].name
            })),
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
});

export const fetchTV = createAsyncThunk("home/fetchTV", async (page: number) => {
    try {
        const genresList = await (await fetch(genre.listTv)).json() as {
            genres: { id: number, name: string }[]
        }

        const popular = fetch(tv.popular(page));
        const topRated = fetch(tv.topRated(page));

        const genresData = genresList.genres.map(async (_genre) => {
            const res = fetch(genre.tv(_genre.id, page));
            return res
        });

        const data = await Promise.all([popular, topRated, ...genresData]);
        const res = await Promise.all(data.map((res) => res.json()));

        return {
            popular: res[0].results.map((tv: any) => ({ ...tv, media_type: "tv" })),
            topRated: res[1].results.map((tv: any) => ({ ...tv, media_type: "tv" })),
            genres: res.slice(2).map((genre, i) => ({ 
                results: genre.results.map((tv: any) => ({ ...tv, media_type: "tv" })),
                id: genresList.genres[i].id, name: genresList.genres[i].name })),
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
});


export const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setLastRefreshed: (state, action: PayloadAction<number>) => {
            state.lastRefreshed = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTrending.fulfilled, (state, action) => {
            state.trending = action.payload;
            state.lastRefreshed = Date.now();
        });
        builder.addCase(fetchTrending.rejected, (state, action) => {
            console.error(action.error);
        });
        builder.addCase(fetchGenre.fulfilled, (state, action) => {
            state.genre = action.payload;
        });
        builder.addCase(fetchGenre.rejected, (state, action) => {
            console.error(action.error);
        });
        builder.addCase(fetchMovies.fulfilled, (state, action) => {
            state.movies = {
                ...action.payload,
                lastRefreshed: Date.now(),
            }
        });
        builder.addCase(fetchMovies.rejected, (state, action) => {
            console.error(action.error);
        });
        builder.addCase(fetchTV.fulfilled, (state, action) => {
            state.tv = {
                ...action.payload,
                lastRefreshed: Date.now(),
            }
        });
        builder.addCase(fetchTV.rejected, (state, action) => {
            console.error(action.error);
        });
    },
});

export const homeActions = homeSlice.actions;
export default homeSlice.reducer;
