import axiosInstance from "./axiosInstance";

// Response interface for resume stats
export interface ResumeStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalScans: number;
    weeklyScans: number;
    weeklyAvg: number;
    bestScore: number;
    lastScanDate: string | null;
    improvementTrend: number;
    trendInterpretation: {
      status: string;
      message: string;
    };
    improvementPercentage: string;
    // Updated to array
    lastResumes: Array<{
      scanId: string;
      overallScore: number;
      scanDate: string;
    }>;
    scansLeft: number;
  };
}

// New interface for combined stats response
export interface CombinedStatsResponse {
  success: boolean;
  message: string;
  data: {
    combined: {
      totalScans: number;
      weeklyScans: number;
      weeklyAvg: number;
      bestScore: number;
      improvementTrend: number;
      trendInterpretation: {
        status: string;
        message: string;
      };
      improvementPercentage: string;
    };
    resume: {
      totalScans: number;
      weeklyScans: number;
      weeklyAvg: number;
      bestScore: number;
      lastScanDate: string | null;
      improvementTrend: number;
      trendInterpretation: {
        status: string;
        message: string;
      };
      improvementPercentage: string;
      // Updated to array
      lastResumes: Array<{
        scanId: string;
        overallScore: number;
        scanDate: string;
      }>;
    };
    linkedin: {
      totalScans: number;
      weeklyScans: number;
      weeklyAvg: number;
      bestScore: number;
      lastScanDate: string | null;
      improvementTrend: number;
      trendInterpretation: {
        status: string;
        message: string;
      };
      improvementPercentage: string;
      // New LinkedIn scans array
      lastLinkedins: Array<{
        scanId: string;
        overallScore: number;
        scanDate: string;
      }>;
    };
    scansLeft: number;
  };
}
export interface LastResumeScoresResponse {
  success: boolean;
  message: string;
  data: {
    totalScans: number;
    scores: Array<{
      scanId: string;
      overallScore: number;
      scanDate: string;
    }>;
  };
}

// Export the data type for reuse in Redux
export type CombinedStatsData = CombinedStatsResponse["data"];

export const userAPI = {
  // Get user resume statistics
  getResumeStats: async (): Promise<ResumeStatsResponse> => {
    const response = await axiosInstance.get("/user/resume-stats");
    return response.data;
  },

  // Get combined statistics
  getCombinedStats: async (): Promise<CombinedStatsResponse> => {
    const response = await axiosInstance.get("/user/combined-stats");
    return response.data;
  },

  // Get last resume scores for chart
  getLastResumeScores: async (): Promise<LastResumeScoresResponse> => {
    const response = await axiosInstance.get("/user/last-resume-scores");
    return response.data;
  },
};
