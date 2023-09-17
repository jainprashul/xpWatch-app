import auth, {FirebaseAuthTypes} from "@react-native-firebase/auth"
import { createSlice } from "@reduxjs/toolkit"
type initState = {
    user : FirebaseAuthTypes.User | null,
    loading : boolean,
    error : string | null
}

const initialState : initState = {
    user : null,
    loading : false,
    error : null
}


const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        setLoading : (state, action) => {
            state.loading = action.payload
        },
        setError : (state, action) => {
            state.error = action.payload
        },
        setUser : (state, action) => {
            state.user = action.payload
        },
        clearState : (state) => {
            state.loading = false
            state.error = null
        },
    }
})

export const authActions = authSlice.actions

export default authSlice.reducer