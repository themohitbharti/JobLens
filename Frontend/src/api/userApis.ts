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
    lastResume: {
      scanId: string;
      overallScore: number;
      scanDate: string;
    } | null;
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
      lastResume: {
        scanId: string;
        overallScore: number;
        scanDate: string;
      } | null;
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
    };
    scansLeft: number;
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

  // Get combined statistics (if you have this endpoint)
  getCombinedStats: async (): Promise<CombinedStatsResponse> => {
    const response = await axiosInstance.get("/user/combined-stats");
    return response.data;
  },
};
