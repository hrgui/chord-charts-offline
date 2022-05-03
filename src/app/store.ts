import { configureStore } from "@reduxjs/toolkit";
import uiStateReducer from "./core/uiStateSlice";
import darkModeMiddlware from "app/actions/darkModeMiddleware";
import { SongApi } from "./services/songs";
import { SetlistApi } from "./services/setlists";

export function createStore() {
  return configureStore({
    reducer: {
      uiState: uiStateReducer,
      [SongApi.reducerPath]: SongApi.reducer,
      [SetlistApi.reducerPath]: SetlistApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(darkModeMiddlware.middleware)
        .concat(SongApi.middleware as any)
        .concat(SetlistApi.middleware as any),
  });
}

export const store = createStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
