import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { resumeScanAPI, UploadResumeRequest } from "../api/resumeScan";

// Types
interface SectionScore {
  sectionName: string;
  score: number;
  weight: number;
}

interface DetailedFeedback {
  sectionName: string;
  currentScore: number;
  issues: string[];
  aiSuggestion?: {
    originalText: string;
    improvedText: string;
    explanation: string;
    improvementType: string;
  };
  benchmarkResults: Record<string, { passed: boolean; score: number }>;
  _id: string;
}

interface BenchmarkResult {
  passed: boolean;
  score: number;
}

interface UsedPreferences {
  targetIndustry: string;
  experienceLevel: string;
  targetJobTitle: string;
  isUsingDefaults: {
    industry: boolean;
    experienceLevel: boolean;
    jobTitle: boolean;
  };
}

interface ContentInfo {
  originalWordCount: number;
  processedWordCount: number;
  wasTruncated: boolean;
  estimatedTokensUsed: number;
}

interface ResumeScanData {
  scanId: string;
  overallScore: number;
  sectionScores: SectionScore[];
  detailedFeedback: DetailedFeedback[];
  benchmarkResults: Record<string, BenchmarkResult>;
  processingTime: number;
  improvementPotential: number;
  sectionsFound: string[];
  usedPreferences: UsedPreferences;
  contentInfo: ContentInfo;
}

interface ResumeScanState {
  scanData: ResumeScanData | null;
  selectedSection: DetailedFeedback | null;
  loading: boolean;
  uploadProgress: number;
  error: string | null;
  sidebarCollapsed: boolean;
}

// Async thunks
export const uploadAndAnalyzeResume = createAsyncThunk(
  "resumeScan/uploadAndAnalyze",
  async (requestData: UploadResumeRequest, { rejectWithValue }) => {
    try {
      const response = await resumeScanAPI.uploadAndAnalyze(requestData);
      if (!response.success) {
        throw new Error(response.message || "Failed to analyze resume");
      }
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Unknown error occurred");
    }
  },
);

export const fetchResumeScanResult = createAsyncThunk(
  "resumeScan/fetchResult",
  async (scanId: string, { rejectWithValue }) => {
    try {
      const response = await resumeScanAPI.getScanResult(scanId);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch scan result");
      }
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Unknown error occurred");
    }
  },
);

export const fetchSectionAnalysis = createAsyncThunk(
  "resumeScan/fetchSection",
  async (
    { scanId, sectionName }: { scanId: string; sectionName: string },
    { rejectWithValue, getState },
  ) => {
    try {
      const state = getState() as { resumeScan: ResumeScanState };

      // If we already have the scan data, find the section from it
      if (state.resumeScan.scanData) {
        const sectionFeedback = state.resumeScan.scanData.detailedFeedback.find(
          (feedback) => feedback.sectionName === sectionName,
        );
        if (sectionFeedback) {
          return sectionFeedback;
        }
      }

      // If section not found in existing data, fetch the full scan result first
      const response = await resumeScanAPI.getScanResult(scanId);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch scan result");
      }

      const sectionFeedback = response.data.detailedFeedback.find(
        (feedback) => feedback.sectionName === sectionName,
      );

      if (!sectionFeedback) {
        throw new Error("Section not found in scan results");
      }

      return sectionFeedback;
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Unknown error occurred");
    }
  },
);

// Initial state
const initialState: ResumeScanState = {
  scanData: null,
  selectedSection: null,
  loading: false,
  uploadProgress: 0,
  error: null,
  sidebarCollapsed: true, // Sidebar collapsed by default for result pages
};

// Slice
const resumeScanSlice = createSlice({
  name: "resumeScan",
  initialState,
  reducers: {
    clearScanData: (state) => {
      state.scanData = null;
      state.selectedSection = null;
      state.error = null;
      state.uploadProgress = 0;
    },
    clearSelectedSection: (state) => {
      state.selectedSection = null;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload and analyze resume
      .addCase(uploadAndAnalyzeResume.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadAndAnalyzeResume.fulfilled, (state, action) => {
        state.loading = false;
        state.scanData = action.payload;
        state.uploadProgress = 100;
        state.sidebarCollapsed = true; // Ensure sidebar is collapsed
      })
      .addCase(
        uploadAndAnalyzeResume.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload as string;
          state.uploadProgress = 0;
        },
      )
      // Fetch resume scan result
      .addCase(fetchResumeScanResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumeScanResult.fulfilled, (state, action) => {
        state.loading = false;
        state.scanData = action.payload;
        state.sidebarCollapsed = true; // Ensure sidebar is collapsed
      })
      .addCase(
        fetchResumeScanResult.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      )
      // Fetch section analysis
      .addCase(fetchSectionAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSectionAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSection = action.payload;
      })
      .addCase(
        fetchSectionAnalysis.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      );
  },
});

export const {
  clearScanData,
  clearSelectedSection,
  setSidebarCollapsed,
  clearError,
  setUploadProgress,
} = resumeScanSlice.actions;

export default resumeScanSlice.reducer;
