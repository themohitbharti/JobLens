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
    lastScanDate: string;
    improvementTrend: number;
    trendInterpretation: {
      status: string;
      message: string;
    };
    improvementPercentage: string;
  };
}

export const userAPI = {
  // Get user resume statistics
  getResumeStats: async (): Promise<ResumeStatsResponse> => {
    const response = await axiosInstance.get("/user/resume-stats");
    return response.data;
  },
};
