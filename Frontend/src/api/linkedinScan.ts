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
  scanLinkedInProfile: async (data: FormData) => {
    const response = await axiosInstance.post("/linkedin/scan", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data)
    return response.data;
  },
};
