import { configureStore } from "@reduxjs/toolkit";
import googleUserReducer from "./slices/googleUserSlice.ts";

export const store = configureStore({
  reducer: {
    googleUser: googleUserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
