import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Winner {
  profile: string;
  fileName: string;
  scoreDifference: number;
  reason?: string; // Add this optional property
}

export interface ProfileScore {
  fileName: string;
  overallScore: number;
  rank: number;
}

export interface KeyDifferences {
  profile1Advantages: string[];
  profile2Advantages: string[];
  commonWeaknesses: string[];
  improvementOpportunities: string[];
  bestPractices?: string[]; // Add this optional property
}

export interface BenchmarkComparison {
  benchmark: string;
  profile1: {
    score: number;
    passed: boolean;
    status: string;
  };
  profile2: {
    score: number;
    passed: boolean;
    status: string;
  };
  difference: number;
  importance: string;
}

export interface SectionComparison {
  sectionName: string;
  profile1: {
    score: number;
    hasSection: boolean;
    status: string;
  };
  profile2: {
    score: number;
    hasSection: boolean;
    status: string;
  };
  difference: number;
  keyDifferences: string[];
}

export interface Recommendations {
  forProfile1: string[];
  forProfile2: string[];
  generalAdvice: string[];
}

export interface DetailedInsights {
  strongestAreas: {
    profile1: string[];
    profile2: string[];
  };
  weakestAreas: {
    profile1: string[];
    profile2: string[];
  };
  competitiveAdvantages: {
    profile1: string[];
    profile2: string[];
  };
  improvementAreas?: string[]; // Make this optional
}

export interface UsedPreferences {
  targetIndustry: string;
  experienceLevel: string;
  targetJobTitle: string;
  keywords: string[];
}

export interface LinkedinComparisonResult {
  winner: Winner;
  scores: {
    profile1: ProfileScore;
    profile2: ProfileScore;
  };
  keyDifferences: KeyDifferences;
  benchmarkComparison: BenchmarkComparison[];
  sectionComparison: SectionComparison[];
  recommendations: Recommendations;
  detailedInsights: DetailedInsights;
  processingTime: number;
  usedPreferences: UsedPreferences;
  comparisonDate: string;
}

interface LinkedinCompareState {
  comparisonResult: LinkedinComparisonResult | null;
  loading: boolean;
  error: string | null;
}

const initialState: LinkedinCompareState = {
  comparisonResult: null,
  loading: false,
  error: null,
};

const linkedinCompareSlice = createSlice({
  name: "linkedinCompare",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setComparisonResult: (
      state,
      action: PayloadAction<LinkedinComparisonResult>,
    ) => {
      state.comparisonResult = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearComparisonResult: (state) => {
      state.comparisonResult = null;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setComparisonResult,
  clearComparisonResult,
  setError,
  clearError,
} = linkedinCompareSlice.actions;

export default linkedinCompareSlice.reducer;
