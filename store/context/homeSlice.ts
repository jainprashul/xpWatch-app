import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { animeX, trending } from "../../utils/constants";
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
    }
}

const initialState: initState = {
    name: "Home",
    data: [],
    trending: {
        movies: [],
        tv: [],
        all: [],
        anime: [],
    }
};

export const fetchTrending = createAsyncThunk("home/fetchTrending", async () => {
    try {
        const all = fetch(trending.all);
        const movies = fetch(trending.movies);
        const tv = fetch(trending.tv);
        const anime = fetch(animeX.popular(1));
        const data = await Promise.all([all, movies, tv, anime]);

        const res = await Promise.all(data.map((res) => res.json()));
        return {
            all: res[0].results,
            movies: res[1].results,
            tv: res[2].results,
            anime: res[3].data,
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
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTrending.fulfilled, (state, action) => {
            state.trending = action.payload;
        });
        builder.addCase(fetchTrending.rejected, (state, action) => {
            console.log(action.error);
        });
    },
});

export const homeActions = homeSlice.actions;
export default homeSlice.reducer;
