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
export interface LastFiveScansResponse {
  success: boolean;
  message: string;
  data: {
    totalScans: number;
    resumeScans: number;
    linkedinScans: number;
    averageScore: number;
    scans: Array<{
      scanId: string;
      overallScore: number;
      scanDate: string;
      scanType: "resume" | "linkedin";
    }>;
  };
}

// Response interface for LinkedIn stats
export interface LinkedinStatsResponse {
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
    lastLinkedins: Array<{
      scanId: string;
      overallScore: number;
      scanDate: string;
    }>;
    scansLeft: number;
  };
}

// Add this interface for user profile response
export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    email: string;
    fullName: string;
    googleId?: string;
    coverImage?: string;
    createdAt: string;
    updatedAt: string;
    dailyScans: Array<{
      date: string;
      totalCount: number;
      resumeCount: number;
      linkedinCount: number;
      _id: string;
    }>;
    resumeStats: {
      totalScans: number;
      weeklyScans: number;
      weeklyAvg: number;
      bestScore: number;
      lastScanDate?: string;
      improvementTrend: number;
    };
    linkedinStats: {
      totalScans: number;
      weeklyScans: number;
      weeklyAvg: number;
      bestScore: number;
      lastScanDate?: string;
      improvementTrend: number;
    };
    lastResumes: Array<{
      scanId: string;
      overallScore: number;
      scanDate: string;
    }>;
    lastLinkedins: Array<{
      scanId: string;
      overallScore: number;
      scanDate: string;
    }>;
    scansLeft: number;
  };
}

// Add these new interfaces for profile updates
export interface UpdateProfileRequest {
  fullName: string;
  // Add more fields as they become available in the backend
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UpdatePreferencesRequest {
  targetIndustry: string;
  experienceLevel: string;
  targetJobTitle: string;
  emailNotifications: boolean;
  weeklyReports: boolean;
  scanReminders: boolean;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    email: string;
    fullName: string;
    // Add other fields as they become available
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

  // Get last five scans
  getLastFiveScans: async (): Promise<LastFiveScansResponse> => {
    const response = await axiosInstance.get("/user/last-five-scans");
    return response.data;
  },

  // Get LinkedIn statistics
  getLinkedinStats: async (): Promise<LinkedinStatsResponse> => {
    const response = await axiosInstance.get("/user/linkedin-stats");
    return response.data;
  },

  // Get user profile using existing API
  getUserProfile: async (): Promise<UserProfileResponse> => {
    const response = await axiosInstance.get("/user/profile");
    return response.data;
  },

  // Update user profile using existing API
  updateProfile: async (
    profileData: UpdateProfileRequest,
  ): Promise<UpdateProfileResponse> => {
    const response = await axiosInstance.put("/user/profile", profileData);
    return response.data;
  },

  // Change password
  changePassword: async (
    passwordData: ChangePasswordRequest,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post(
      "/user/change-password",
      passwordData,
    );
    return response.data;
  },

  // Update user preferences (you'll need to implement this in the backend)
  updatePreferences: async (
    preferencesData: UpdatePreferencesRequest,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.put(
      "/user/preferences",
      preferencesData,
    );
    return response.data;
  },
};
