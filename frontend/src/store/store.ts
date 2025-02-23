// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import imageReducer from "./imageSlice";

const store = configureStore({
  reducer: {
    images: imageReducer, // Add more reducers here if needed
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;