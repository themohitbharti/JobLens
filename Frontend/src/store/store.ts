import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import resumeScanSlice from "./resumeScanSlice";
import resumeCompareReducer from "./resumeCompareSlice";
import linkedinCompareReducer from "./linkedinCompareSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    resumeScan: resumeScanSlice,
    resumeCompare: resumeCompareReducer,
    linkedinCompare: linkedinCompareReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
