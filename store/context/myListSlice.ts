import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from ".."
import { MediaMini } from "../../types/meta/MediaMeta"

type initState = {
    loading: boolean
    error: string | null
    search: string
    data: {
        tv: Record<string, MediaMini>
        movie: Record<string, MediaMini>
        anime: Record<string, MediaMini>
        history: Record<string, {
            s: number, e: number
        }>
        watchHistory: Record<string, MediaMini>
        lastWatched: Record<string, MediaMini>
        watchedAlready: Record<string, MediaMini>
    }
}

const initState: initState = {
    loading: false,
    error: null,
    search: '',
    data: {
        tv: {},
        movie: {},
        anime: {},
        history: {},
        watchHistory: {},
        lastWatched: {},
        watchedAlready: {}
    },
}

const myListSlice = createSlice({
    name: 'myList',
    initialState: initState,
    reducers: {
        setSearch(state, action: PayloadAction<string>) {
            state.search = action.payload
        },
        clearSearch(state) {
            state.search = ''
        },
        addToHistory(state, action: PayloadAction<{
            id: string, s: number, e: number
        }>) {
            const { id, s, e } = action.payload
            state.data.history[id] = { s, e }
        },
        setData(state, action: PayloadAction<any>) {
            state.data = action.payload
        },

        add(state, action: PayloadAction<{ id: string, data: any, type: string }>) {
            const { id, data, type } = action.payload
            // @ts-ignore
            state.data[type][id] = data
        },
        remove(state, action: PayloadAction<{ id: string, type: string }>) {
            const { id, type } = action.payload
            // @ts-ignore
            delete state.data[type][id]
        },

        addMedia(state, action: PayloadAction<MediaMini>) {
            const { id, media_type } = action.payload
            if (media_type === 'anilist') {
                state.data.anime[id] = action.payload;
            } else {
                state.data[media_type as keyof typeof state.data][id] = action.payload;
            }
        },
        removeMedia(state, action: PayloadAction<{ id: string, media_type: string}>) {
            const { id, media_type } = action.payload
            delete state.data[media_type as keyof typeof state.data][id]
        },

        addWatchedAlready(state, action: PayloadAction<MediaMini>) {
            const { id } = action.payload
            state.data.watchedAlready[id] = action.payload;
            delete state.data.anime[id]
            delete state.data.movie[id]
            delete state.data.tv[id]
        },
        removeWatchedAlready(state, action: PayloadAction<string>) {
            const id = action.payload
            delete state.data.watchedAlready[id]
        },

        addWatchHistory(state, action: PayloadAction<MediaMini>) {
            const { id } = action.payload
            state.data.watchHistory[id] = action.payload;
            state.data.lastWatched[id] = action.payload;
        },
        removeWatchHistory(state, action: PayloadAction<string>) {
            const id = action.payload
            delete state.data.watchHistory[id]
        },
        clearALL(state) {
            state.data = initState.data
        },
    }
})

export const myListActions = myListSlice.actions
export default myListSlice.reducer

export const selectSearch = (state: RootState) => state.myList.search;


export const selectTV = (state: RootState) => Object.values(state.myList.data.tv).filter((item: any) => filterBySearch(item, state.myList.search));
export const selectMovie = (state: RootState) => Object.values(state.myList.data.movie).filter((item) => filterBySearch(item, state.myList.search));
export const selectWatchedAlready = (state: RootState) => Object.values(state.myList.data.watchedAlready).filter((item: any) => filterBySearch(item, state.myList.search));
export const selectAnime = (state: RootState) => Object.values(state.myList.data.anime).filter((item: any) => filterBySearch(item, state.myList.search));

export const selectHistory = (state: RootState) => state.myList.data.history;
export const selectHistoryByID = (id: string) => (state: RootState) => state.myList.data.history[id];
export const selectRecents = (state: RootState) => Object.values(state.myList.data.lastWatched)
export const selectWatchHistory = (state: RootState) => Object.values(state.myList.data.watchHistory)
type hasType = 'tv' | 'movie' | 'anime' | 'watchedAlready';
// @ts-ignore
export const has = (type: hasType, id: string) => (state: RootState) => state.myList.data?.[type]?.[id] !== undefined;

const filterBySearch = (item: any, query: string) => {
    if (!query) return true;
    const name = item?.name?.toLowerCase() || item?.title?.userPreferred?.toLowerCase() || item?.title?.english?.toLowerCase() || item?.title?.romaji?.toLowerCase() || item?.title?.toLowerCase();
    return name.toLowerCase().includes(query.toLowerCase());
}


