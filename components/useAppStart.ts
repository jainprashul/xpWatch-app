import { fetchGenre, fetchTrending } from "../store/context/homeSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { authActions } from "../store/context/authSlice";
import { loadUserDataFromCloud, syncwithRedux } from "../utils/service";

export function useAppStart() {
    const dispatch = useAppDispatch();
    const lastRefreshTime = useAppSelector((state) => state.home.lastRefreshed);

    // const user = useAppSelector((state) => state.auth.user);
            

    useEffect(() => {
        if (Date.now() - lastRefreshTime > 1000 * 60 * 60 * 24){
            // 24 hours
            dispatch(fetchTrending())
            dispatch(fetchGenre())
        }
        onAppStart();
    }, []);

    // auth handling
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged((user) => {
            if (user) {
                // user is logged in
                dispatch(authActions.setUser(user))
                syncwithRedux(user.uid);
            } else {
                // user is logged out
                dispatch(authActions.setUser(null))
            }
        });
        return subscriber;
    }, []);
        
}

function onAppStart() {
    
}
