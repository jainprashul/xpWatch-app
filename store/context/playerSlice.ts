import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type initState = {
    src : string;
}

const initialState : initState = {
    src : ''
}

const playerSlice = createSlice({
    name : 'player',
    initialState,
    reducers : {
        setSrc(state, action : PayloadAction<string>){
            state.src = action.payload
        }
    }
})

export const playerAction = playerSlice.actions

export default playerSlice.reducer;

