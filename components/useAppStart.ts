import { fetchTrending } from "../store/context/homeSlice";
import { useAppDispatch } from "../store/hooks";
import { useEffect } from "react";

export function useAppStart() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchTrending())
        onAppStart();
    }, []);
}

function onAppStart() {
    
}