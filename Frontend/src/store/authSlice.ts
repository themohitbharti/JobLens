import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { userAPI, CombinedStatsData } from "../api/userApis";
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

// Add async thunk for fetching combined stats
export const fetchCombinedStats = createAsyncThunk(
  "auth/fetchCombinedStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getCombinedStats();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch combined stats");
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
  combinedStatsData: CombinedStatsData | null; // Now properly typed
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  resumeStatsData: null,
  combinedStatsData: null,
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
      state.combinedStatsData = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      if (state.user) {
        state.user = action.payload;
      }
    },
    // Update user's scansLeft after a successful scan
    updateScansLeft: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.scansLeft = action.payload;
      }
    },
    // Update lastResume after a successful scan
    updateLastResume: (
      state,
      action: PayloadAction<{
        scanId: string;
        overallScore: number;
        scanDate: string;
      }>,
    ) => {
      if (state.user) {
        state.user.lastResume = action.payload;
      }
    },
    clearResumeStats: (state) => {
      state.resumeStatsData = null;
    },
    clearCombinedStats: (state) => {
      state.combinedStatsData = null;
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
        // Update user's scansLeft if user exists
        if (state.user && action.payload.scansLeft !== undefined) {
          state.user.scansLeft = action.payload.scansLeft;
        }
        // Update user's lastResume if user exists (handle null properly)
        if (state.user) {
          state.user.lastResume = action.payload.lastResume;
        }
      })
      .addCase(
        fetchResumeStats.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      )
      // Fetch combined stats
      .addCase(fetchCombinedStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCombinedStats.fulfilled, (state, action) => {
        state.loading = false;
        state.combinedStatsData = action.payload;
        // Update user's scansLeft from combined stats
        if (state.user && action.payload.scansLeft !== undefined) {
          state.user.scansLeft = action.payload.scansLeft;
        }
        // Update user's lastResume from resume stats (handle null properly)
        if (state.user && action.payload.resume) {
          state.user.lastResume = action.payload.resume.lastResume;
        }
      })
      .addCase(
        fetchCombinedStats.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      );
  },
});

export const {
  login,
  logout,
  updateUser,
  updateScansLeft,
  updateLastResume,
  clearResumeStats,
  clearCombinedStats,
} = authSlice.actions;
export default authSlice.reducer;
