import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { linkedinScanAPI } from "../api/linkedinScan";

export interface LinkedinScanResult {
  scanId: string;
  overallScore: number;
  sectionScores: Array<{
    sectionName: string;
    score: number;
    weight: number;
  }>;
  detailedFeedback: Array<{
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
    _id?: string; // Keep as optional since API might not always return this
  }>;
  benchmarkResults: Record<string, { passed: boolean; score: number }>;
  processingTime: number;
  improvementPotential: number;
  sectionsFound: string[];
  usedPreferences: {
    targetIndustry: string;
    experienceLevel: string;
    targetJobTitle: string;
    isUsingDefaults: {
      industry: boolean;
      experienceLevel: boolean;
      jobTitle: boolean;
    };
  };
  contentInfo: {
    originalWordCount: number;
    processedWordCount: number;
    wasTruncated: boolean;
    estimatedTokensUsed: number;
  };
}

// Create a separate interface for selected section that matches the API response
interface LinkedinDetailedFeedback {
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
  _id?: string; // Optional to match API response
}

interface LinkedinScanState {
  scanResult: LinkedinScanResult | null;
  selectedSection: LinkedinDetailedFeedback | null;
  loading: boolean;
  uploadProgress: number;
  error: string | null;
  sidebarCollapsed: boolean;
}

// Define the request interface similar to resume scan
export interface LinkedinScanRequest {
  linkedin: File;
  targetIndustry?: string;
  experienceLevel?: string;
  targetJobTitle?: string;
}

// Async thunks
export const scanLinkedinProfile = createAsyncThunk(
  "linkedinScan/scanProfile",
  async (requestData: LinkedinScanRequest, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("linkedin", requestData.linkedin);

      if (requestData.targetIndustry) {
        formData.append("targetIndustry", requestData.targetIndustry);
      }
      if (requestData.experienceLevel) {
        formData.append("experienceLevel", requestData.experienceLevel);
      }
      if (requestData.targetJobTitle) {
        formData.append("targetJobTitle", requestData.targetJobTitle);
      }

      const response = await linkedinScanAPI.scanLinkedInProfile(formData);
      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to analyze LinkedIn profile",
        );
      }
      return response.data.data;
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Unknown error occurred");
    }
  },
);

export const fetchLinkedinScanResult = createAsyncThunk(
  "linkedinScan/fetchResult",
  async (scanId: string, { rejectWithValue }) => {
    try {
      const response = await linkedinScanAPI.getScanResult(scanId);
      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to fetch scan result",
        );
      }
      return response.data.data;
    } catch (error: unknown) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Unknown error occurred");
    }
  },
);

export const fetchLinkedinSectionAnalysis = createAsyncThunk(
  "linkedinScan/fetchSection",
  async (
    { scanId, sectionName }: { scanId: string; sectionName: string },
    { rejectWithValue, getState },
  ) => {
    try {
      const state = getState() as { linkedinScan: LinkedinScanState };

      // If we already have the scan data, find the section from it
      if (state.linkedinScan.scanResult) {
        const sectionFeedback =
          state.linkedinScan.scanResult.detailedFeedback.find(
            (feedback) => feedback.sectionName === sectionName,
          );
        if (sectionFeedback) {
          return sectionFeedback;
        }
      }

      // If section not found in existing data, fetch the full scan result first
      const response = await linkedinScanAPI.getScanResult(scanId);
      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to fetch scan result",
        );
      }

      const sectionFeedback = response.data.data.detailedFeedback.find(
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

const initialState: LinkedinScanState = {
  scanResult: null,
  selectedSection: null,
  loading: false,
  uploadProgress: 0,
  error: null,
  sidebarCollapsed: true,
};

const linkedinScanSlice = createSlice({
  name: "linkedinScan",
  initialState,
  reducers: {
    clearScanResult: (state) => {
      state.scanResult = null;
      state.selectedSection = null;
      state.error = null;
      state.uploadProgress = 0;
    },
    clearSelectedSection: (state) => {
      state.selectedSection = null;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Scan LinkedIn profile
      .addCase(scanLinkedinProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(scanLinkedinProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.scanResult = action.payload;
        state.error = null;
        state.uploadProgress = 100;
      })
      .addCase(scanLinkedinProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.uploadProgress = 0;
      })
      // Fetch scan result
      .addCase(fetchLinkedinScanResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLinkedinScanResult.fulfilled, (state, action) => {
        state.loading = false;
        state.scanResult = action.payload;
        state.error = null;
      })
      .addCase(fetchLinkedinScanResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch section analysis
      .addCase(fetchLinkedinSectionAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLinkedinSectionAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSection = action.payload;
        state.error = null;
      })
      .addCase(fetchLinkedinSectionAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearScanResult,
  clearSelectedSection,
  setSidebarCollapsed,
  clearError,
  setUploadProgress,
} = linkedinScanSlice.actions;

export default linkedinScanSlice.reducer;
