import axiosInstance from "./axiosInstance";

interface CompareLinkedinResponse {
  success: boolean;
  message: string;
  data: {
    winner: {
      profile: string;
      fileName: string;
      scoreDifference: number;
    };
    scores: {
      profile1: {
        fileName: string;
        overallScore: number;
        rank: number;
      };
      profile2: {
        fileName: string;
        overallScore: number;
        rank: number;
      };
    };
    keyDifferences: {
      profile1Advantages: string[];
      profile2Advantages: string[];
      commonWeaknesses: string[];
      improvementOpportunities: string[];
    };
    benchmarkComparison: Array<{
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
    }>;
    sectionComparison: Array<{
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
    }>;
    recommendations: {
      forProfile1: string[];
      forProfile2: string[];
      generalAdvice: string[];
    };
    detailedInsights: {
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

interface LinkedinScanResponse {
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
      _id?: string;
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

export const linkedinCompareAPI = {
  compareProfiles: async (
    formData: FormData,
  ): Promise<CompareLinkedinResponse> => {
    const response = await axiosInstance.post<CompareLinkedinResponse>(
      "/linkedin/compare",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
};

export const linkedinScanAPI = {
  scanLinkedInProfile: (data: FormData) => {
    return axiosInstance.post<LinkedinScanResponse>("/linkedin/scan", data);
  },

  getScanResult: (scanId: string) => {
    return axiosInstance.get<LinkedinScanResponse>(`/linkedin/scan/${scanId}`);
  },
};
