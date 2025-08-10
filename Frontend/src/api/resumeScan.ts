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

interface CompareResumeResponse {
  success: boolean;
  message: string;
  data: {
    winner: {
      resume: string;
      fileName: string;
      scoreDifference: number;
    };
    scores: {
      resume1: {
        fileName: string;
        overallScore: number;
        rank: number;
      };
      resume2: {
        fileName: string;
        overallScore: number;
        rank: number;
      };
    };
    keyDifferences: {
      resume1Advantages: string[];
      resume2Advantages: string[];
      commonWeaknesses: string[];
      improvementOpportunities: string[];
    };
    benchmarkComparison: Array<{
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
    }>;
    sectionComparison: Array<{
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
    }>;
    recommendations: {
      forResume1: string[];
      forResume2: string[];
      generalAdvice: string[];
    };
    detailedInsights: {
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
    };
    processingTime: number;
    usedPreferences: {
      targetIndustry: string;
      experienceLevel: string;
      targetJobTitle: string;
      keywords: string[];
    };
    comparisonDate: string;
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


export const resumeCompareAPI = {
  compareResumes: async (formData: FormData): Promise<CompareResumeResponse> => {
    try {
      const response = await axiosInstance.post(
        "/resume/compare",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to compare resumes");
    }
  },
};
