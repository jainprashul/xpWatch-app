import { fetchTrending } from "../store/context/homeSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect } from "react";

export function useAppStart() {
    const dispatch = useAppDispatch();
    const lastRefreshTime = useAppSelector((state) => state.home.lastRefreshed);

    useEffect(() => {
        if (Date.now() - lastRefreshTime > 1000 * 60 * 60 * 24){
            // 24 hours
            dispatch(fetchTrending())
        }
        onAppStart();
    }, []);
}

function onAppStart() {
    
}