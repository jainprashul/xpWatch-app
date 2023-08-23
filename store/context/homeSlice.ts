import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { animeX, genre, hindi, trending } from "../../utils/constants";
import { Media } from "../../types/media";
import { TV } from "../../types/tv";
import { Movie } from "../../types/movie";
import { Anime } from "../../types/anime";

type initState = {
    name: string;
    data: any[];
    trending: {
        movies: Array<Movie>;
        tv: Array<TV>;
        all: Array<Media>;
        anime: Array<Anime>;
        bollywood: Array<Movie>;
    },
    discover: {
        movies: Array<Movie>;
        tv: Array<TV>;
        all: Array<Media>;
        anime: Array<Anime>;
    },
    lastRefreshed: number;
    genre : {
        id : number;
        name : string;
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
    lastRefreshed: 0,
    genre : [],
};

export const fetchTrending = createAsyncThunk("home/fetchTrending", async () => {
    try {
        const all = fetch(trending.all);
        const movies = fetch(trending.today.movies);
        const tv = fetch(trending.today.tv);
        const anime = fetch(animeX.popular(1));
        const bollywood = fetch(hindi.recentMovie(1));
        const data = await Promise.all([all, movies, tv, anime, bollywood]);

        const res = await Promise.all(data.map((res) => res.json()));
        return {
            all: res[0].results,
            movies: res[1].results,
            tv: res[2].results,
            anime: res[3].data,
            bollywood: res[4].results.map((movie: any) => ({ ...movie, media_type: "movie" })),
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
            console.log(action.error);
        });
        builder.addCase(fetchGenre.fulfilled, (state, action) => {
            state.genre = action.payload;
        });
    },
});

export const homeActions = homeSlice.actions;
export default homeSlice.reducer;
