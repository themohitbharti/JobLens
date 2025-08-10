import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import resumeScanSlice from "./resumeScanSlice";
import resumeCompareReducer from "./resumeCompareSlice"

const store = configureStore({
  reducer: {
    auth: authSlice,
    resumeScan: resumeScanSlice,
    resumeCompare: resumeCompareReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
