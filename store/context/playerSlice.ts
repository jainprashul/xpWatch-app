import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AnimeMeta, MovieMeta, TVMeta } from "../../types/meta/MediaMeta";

type initState = {
    loading : boolean
    src : string | null
    data : TVMeta | MovieMeta | AnimeMeta | null
}

const initialState : initState = {
    loading : true,
    src : null,
    data : null
}

const playerSlice = createSlice({
    name : 'player',
    initialState,
    reducers : {
        setSrc(state, action : PayloadAction<string | null>){
            state.src = action.payload
        },
        setData(state, action : PayloadAction<TVMeta | MovieMeta | AnimeMeta | null>){
            state.data = action.payload
        },
        setLoading(state, action : PayloadAction<boolean>){
            state.loading = action.payload
        }
    }
})

export const playerAction = playerSlice.actions

export default playerSlice.reducer;
