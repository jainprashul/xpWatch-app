import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from ".."
import { MovieDetail } from "../../types/movieDetail"
import { TVDetails } from "../../types/tvDetails"
import { AnimeDetail } from "../../types/animeDetail"

type initState = {
    loading : boolean
    error : string | null
    search : string
    data : {
        tv : Record<string, any>
        movie : Record<string, MovieDetail>
        anime : Record<string, any>
        history : Record<string, {
            s : number, e : number
        }>
        watchHistory : Record<string, any>
        lastWatched : any[]
        watchedAlready : Record<string, any>
    }
}

const initState : initState = {
    loading : false,
    error : null,
    search : '',
    data : {
        tv : {},
        movie : {},
        anime : {},
        history : {},
        watchHistory : {},
        lastWatched : [],
        watchedAlready : {}
    },
}

const myListSlice = createSlice({
    name : 'myList',
    initialState : initState,
    reducers : {
        setSearch(state, action : PayloadAction<string>){
            state.search = action.payload
        },
        clearSearch(state){
            state.search = ''
        },
        addToHistory(state, action : PayloadAction<{
            id : string , s : number, e : number
        }>){
            const { id , s , e } = action.payload
            state.data.history[id] = { s , e }
        },
        addToLastWatched(state, action : PayloadAction<any>){
            const { id , data } = action.payload
            state.data.lastWatched.unshift({ id , data })

        },
        setData(state, action : PayloadAction<any>){
            state.data = action.payload
        },

        add(state , action : PayloadAction<{ id : string, data : any , type : string }>){
            const { id , data , type } = action.payload
            // @ts-ignore
            state.data[type][id] = data
        },
        remove(state , action : PayloadAction<{ id : string, type : string }>){
            const { id , type } = action.payload
            // @ts-ignore
            delete state.data[type][id]
        },
        addMovie(state , action : PayloadAction<MovieDetail>){
            const { id  } = action.payload
            state.data.movie[id] = action.payload;
        },
        removeMovie(state , action : PayloadAction<string>){
            const id = action.payload
            delete state.data.movie[id]
        },
        addTVShow(state , action : PayloadAction<TVDetails>){
            const { id  } = action.payload
            state.data.tv[id] = action.payload;
        },
        removeTVShow(state , action : PayloadAction<string>){
            const id  = action.payload
            delete state.data.tv[id]
        },
        addAnime(state , action : PayloadAction<AnimeDetail>){
            const { id  } = action.payload
            state.data.anime[id] = action.payload;
        },
        removeAnime(state , action : PayloadAction<string>){
            const id = action.payload
            delete state.data.anime[id]
        },
    }
})

export const myListActions = myListSlice.actions
export default myListSlice.reducer

export const selectSearch = (state : RootState) => state.myList.search;


export const selectTV = (state : RootState) => state.myList.data.tv.filter((item : any) => filterBySearch(item, state.myList.search));
export const selectMovie = (state : RootState) => Object.values(state.myList.data.movie).filter((item ) => filterBySearch(item, state.myList.search));
export const selectWatchedAlready = (state : RootState) => Object.values(state.myList.data.watchedAlready).filter((item : any) => filterBySearch(item, state.myList.search));
export const selectAnime = (state : RootState) => state.myList.data.anime.filter((item : any) => filterBySearch(item, state.myList.search));

export const selectHistory = (state : RootState) => state.myList.data.history;
export const selectHistoryByID = (id : string) => (state : RootState) => state.myList.data.history[id];
export const selectLastWatched = (state : RootState) => state.myList.data.lastWatched;
export const selectWatchHistory = (state : RootState) => Object.values(state.myList.data.watchHistory).sort((a, b) => b.lastUpdated - a.lastUpdated);
type hasType = 'tv' | 'movie' | 'anime'
// @ts-ignore
export const has = (type : hasType, id : string) => (state : RootState) => state.myList.data?.[type]?.[id] !== undefined;

const filterBySearch = (item : any, query : string) => {
    const name = item?.name?.toLowerCase() || item?.title?.userPreferred?.toLowerCase() || item?.title?.english?.toLowerCase() || item?.title?.romaji?.toLowerCase() || item?.title?.toLowerCase();
    return name.toLowerCase().includes(query.toLowerCase());
}


