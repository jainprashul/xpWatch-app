import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Episode } from "../../types/animeDetail"

type initState = {
    current : {
        episode: number,
    },
    episodes : Episode[]
}

const initialState : initState = {
    current : {
        episode: 1,
    },
    episodes : []

}

const animeReducer = createSlice({
    name: "anime",
    initialState,
    reducers: {
        setEpisode: (state, action : PayloadAction<number>) => {
            state.current.episode = action.payload
        },
        setEpisodeList: (state, action : PayloadAction<Episode[]>) => {
            state.episodes = action.payload
        },
    }
})

export const animeActions = animeReducer.actions
export default animeReducer.reducer

