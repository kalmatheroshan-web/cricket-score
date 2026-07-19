import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 100 },
      serializableCheck: { warnAfter: 100 },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;