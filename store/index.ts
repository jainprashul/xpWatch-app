import { Action, AnyAction, Dispatch, MiddlewareAPI, combineReducers, configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from "redux-persist";
import homeSlice from "./context/homeSlice";
import tvSlice from "./context/tvSlice";
import myListSlice from "./context/myListSlice";
import playerSlice from "./context/playerSlice";
import animeSlice from "./context/animeSlice";
import authSlice from "./context/authSlice";


const rootReducer = combineReducers({
 home : homeSlice,
 tv : tvSlice,
 anime : animeSlice ,
 myList : myListSlice,
 player : playerSlice,
 auth : authSlice,
})

const persistConfig  = {
  key: 'root',
  storage : AsyncStorage,
  whitelist : ['myList', "home"]
}


export const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer : persistedReducer as unknown as typeof rootReducer,
})

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = Action | ((dispatch: AppDispatch, getState: () => RootState) => ReturnType);
// Redux Middleware
export interface ReduxMiddleware<
  S = any, // type of the state supported by this middleware.
  D extends Dispatch = Dispatch, // type of the dispatch supported by this middleware.
  A extends Action = AnyAction, // type of the action(s) supported by this middleware, inferred from actions passed to applyMiddleware
  DispatchExt = {} // optional override return behavior of dispatch
> {
  (api: MiddlewareAPI<D, S>): (next: D) => (action: A) => A | DispatchExt;
}
