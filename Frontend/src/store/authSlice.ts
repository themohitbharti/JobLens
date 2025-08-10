import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { userAPI } from "../api/userApis";
import type {
  User,
  ResumeStatsData,
  CombinedStatsData,
  LastResumeScoresData,
} from "../types";
import { getResumeStats } from "../api/resumeStatsAPI";

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
      const response = await getResumeStats();
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("failed to fetch resume stats");
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

// Async thunk for fetching last resume scores
export const fetchLastResumeScores = createAsyncThunk(
  "auth/fetchLastResumeScores",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getLastResumeScores();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch resume scores");
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
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  resumeStatsData: ResumeStatsData | null;
  combinedStatsData: CombinedStatsData | null;
  lastResumeScores: LastResumeScoresData | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  resumeStatsData: null,
  combinedStatsData: null,
  lastResumeScores: null,
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
      state.lastResumeScores = null; // Clear this as well on logout
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
    // Update lastResumes after a successful scan (updated to handle array)
    updateLastResumes: (
      state,
      action: PayloadAction<{
        scanId: string;
        overallScore: number;
        scanDate: string;
      }>,
    ) => {
      if (state.user) {
        // Add new scan to beginning of array
        state.user.lastResumes.unshift(action.payload);
        // Keep only last 5 scans
        if (state.user.lastResumes.length > 5) {
          state.user.lastResumes = state.user.lastResumes.slice(0, 5);
        }
      }
    },
    // New action for updating LinkedIn scans
    updateLastLinkedins: (
      state,
      action: PayloadAction<{
        scanId: string;
        overallScore: number;
        scanDate: string;
      }>,
    ) => {
      if (state.user) {
        // Add new scan to beginning of array
        state.user.lastLinkedins.unshift(action.payload);
        // Keep only last 5 scans
        if (state.user.lastLinkedins.length > 5) {
          state.user.lastLinkedins = state.user.lastLinkedins.slice(0, 5);
        }
      }
    },
    clearResumeStats: (state) => {
      state.resumeStatsData = null;
    },
    clearCombinedStats: (state) => {
      state.combinedStatsData = null;
    },
    clearLastResumeScores: (state) => {
      state.lastResumeScores = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch resume stats
      .addCase(fetchResumeStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResumeStats.fulfilled, (state, action) => {
        state.loading = false;
        state.resumeStatsData = action.payload;
      })
      .addCase(fetchResumeStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
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
        // Update user's lastResumes from resume stats
        if (state.user && action.payload.resume.lastResumes) {
          state.user.lastResumes = action.payload.resume.lastResumes;
        }
        // Update user's lastLinkedins from linkedin stats
        if (state.user && action.payload.linkedin.lastLinkedins) {
          state.user.lastLinkedins = action.payload.linkedin.lastLinkedins;
        }
      })
      .addCase(
        fetchCombinedStats.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      )
      // Fetch last resume scores
      .addCase(fetchLastResumeScores.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLastResumeScores.fulfilled, (state, action) => {
        state.loading = false;
        state.lastResumeScores = action.payload;
      })
      .addCase(fetchLastResumeScores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  login,
  logout,
  updateUser,
  updateScansLeft,
  updateLastResumes,
  updateLastLinkedins,
  clearResumeStats,
  clearCombinedStats,
  clearLastResumeScores,
} = authSlice.actions;
export default authSlice.reducer;
