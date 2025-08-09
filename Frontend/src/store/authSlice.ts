import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { userAPI } from "../api/userApis";
import { User, ResumeStatsData } from "../types";

// Define a type for the minimum required user data
export type PartialUser = Partial<User> & {
  _id: string;
  email: string;
  fullName: string;
};

// Add async thunk for fetching resume stats
export const fetchResumeStats = createAsyncThunk(
  "auth/fetchResumeStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getResumeStats();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch resume stats");
      }
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Unknown error occurred");
    }
  },
);

interface AuthState {
  user: User | null;
  resumeStatsData: ResumeStatsData | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  resumeStatsData: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.resumeStatsData = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      if (state.user) {
        state.user = action.payload;
      }
    },
    clearResumeStats: (state) => {
      state.resumeStatsData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch resume stats
      .addCase(fetchResumeStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumeStats.fulfilled, (state, action) => {
        state.loading = false;
        state.resumeStatsData = action.payload;
      })
      .addCase(
        fetchResumeStats.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      );
  },
});

export const { login, logout, updateUser, clearResumeStats } =
  authSlice.actions;
export default authSlice.reducer;
