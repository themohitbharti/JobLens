import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Winner {
  resume: string;
  fileName: string;
  scoreDifference: number;
}

export interface ResumeScore {
  fileName: string;
  overallScore: number;
  rank: number;
}

export interface KeyDifferences {
  resume1Advantages: string[];
  resume2Advantages: string[];
  commonWeaknesses: string[];
  improvementOpportunities: string[];
}

export interface BenchmarkComparison {
  benchmark: string;
  resume1: {
    score: number;
    passed: boolean;
    status: string;
  };
  resume2: {
    score: number;
    passed: boolean;
    status: string;
  };
  difference: number;
  importance: string;
}

export interface SectionComparison {
  sectionName: string;
  resume1: {
    score: number;
    hasSection: boolean;
    status: string;
  };
  resume2: {
    score: number;
    hasSection: boolean;
    status: string;
  };
  difference: number;
  keyDifferences: string[];
}

export interface Recommendations {
  forResume1: string[];
  forResume2: string[];
  generalAdvice: string[];
}

export interface DetailedInsights {
  strongestAreas: {
    resume1: string[];
    resume2: string[];
  };
  weakestAreas: {
    resume1: string[];
    resume2: string[];
  };
  competitiveAdvantages: {
    resume1: string[];
    resume2: string[];
  };
}

export interface UsedPreferences {
  targetIndustry: string;
  experienceLevel: string;
  targetJobTitle: string;
  keywords: string[];
}

export interface ComparisonResult {
  winner: Winner;
  scores: {
    resume1: ResumeScore;
    resume2: ResumeScore;
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

interface ResumeCompareState {
  comparisonResult: ComparisonResult | null;
  loading: boolean;
  error: string | null;
}

const initialState: ResumeCompareState = {
  comparisonResult: null,
  loading: false,
  error: null,
};

const resumeCompareSlice = createSlice({
  name: "resumeCompare",
  initialState,
  reducers: {
    setComparisonResult: (state, action: PayloadAction<ComparisonResult>) => {
      state.comparisonResult = action.payload;
    },
    clearComparisonResult: (state) => {
      state.comparisonResult = null;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setComparisonResult,
  clearComparisonResult,
  setLoading,
  setError,
} = resumeCompareSlice.actions;

export default resumeCompareSlice.reducer;
