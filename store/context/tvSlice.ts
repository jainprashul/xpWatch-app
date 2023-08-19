import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { SeasonDetail } from "../../types/seasonDetail"

type initState = {
    current : {
        episode: number,
        season: number,
    }
    season : SeasonDetail

    // show : TvShowsX
}

const initialState : initState = {
    current : {
        episode: 1,
        season: 1
    },
    season : {} as SeasonDetail
}

const tvReducer = createSlice({
    name: "tv",
    initialState,
    reducers: {
        setEpisode: (state, action : PayloadAction<number>) => {
            state.current.episode = action.payload
        },
        setSeason: (state, action : PayloadAction<number>) => {
            state.current.season = action.payload
        },
        setSeasonDetail: (state, action : PayloadAction<SeasonDetail>) => {
            state.season = action.payload
        },
        nextEpisode: (state) => {
            if(state.current.episode < state.season.episodes.length){
                state.current.episode += 1
            } else {
                state.current.episode = 1
                state.current.season += 1
            }
        },
        prevEpisode: (state) => {
            if(state.current.episode > 1){
                state.current.episode -= 1
            } else {
                state.current.episode = state.season.episodes.length
                state.current.season -= 1
            }
        }
    }
})

export const tvActions = tvReducer.actions
export default tvReducer.reducer




