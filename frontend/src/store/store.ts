// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import imageReducer from "./imageSlice";
import authReducer from "./authslice";

const store = configureStore({
  reducer: {
    images: imageReducer,
    auth: authReducer, // Add more reducers here if needed
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;