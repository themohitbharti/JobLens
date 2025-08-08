import axiosInstance from "./axiosInstance";

// Request interfaces
export interface UploadResumeRequest {
  resume: File;
  targetIndustry?: string;
  experienceLevel?: string;
  targetJobTitle?: string;
}

// Response interfaces
export interface ResumeScanResponse {
  success: boolean;
  message: string;
  data: {
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
      _id: string;
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
  };
}

export const resumeScanAPI = {
  // Upload resume and get analysis result
  uploadAndAnalyze: async (
    requestData: UploadResumeRequest,
  ): Promise<ResumeScanResponse> => {
    const formData = new FormData();

    // Mandatory field
    formData.append("resume", requestData.resume);

    // Optional fields
    if (requestData.targetIndustry) {
      formData.append("targetIndustry", requestData.targetIndustry);
    }
    if (requestData.experienceLevel) {
      formData.append("experienceLevel", requestData.experienceLevel);
    }
    if (requestData.targetJobTitle) {
      formData.append("targetJobTitle", requestData.targetJobTitle);
    }

    const response = await axiosInstance.post("resume/scan", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000, // 60 seconds timeout for file processing
    });

    return response.data;
  },

  // Get existing scan result by ID (if needed for refresh/reload)
  getScanResult: async (scanId: string): Promise<ResumeScanResponse> => {
    const response = await axiosInstance.get(`resume/scan/${scanId}`);
    return response.data;
  },
};
