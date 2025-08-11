export interface BenchmarkResult {
  passed: boolean;
  score: number;
}

export interface AISuggestion {
  originalText: string;
  improvedText: string;
  explanation: string;
  improvementType: string;
}

export interface DetailedFeedback {
  sectionName: string;
  currentScore: number;
  issues: string[];
  aiSuggestion?: AISuggestion;
  benchmarkResults: Record<string, BenchmarkResult>;
  _id: string;
}

export interface SectionScore {
  sectionName: string;
  score: number;
  weight: number;
}

export interface UsedPreferences {
  targetIndustry: string;
  experienceLevel: string;
  targetJobTitle: string;
  isUsingDefaults: {
    industry: boolean;
    experienceLevel: boolean;
    jobTitle: boolean;
  };
}

export interface ContentInfo {
  originalWordCount: number;
  processedWordCount: number;
  wasTruncated: boolean;
  estimatedTokensUsed: number;
}

export interface LinkedInScanResult {
  scanId: string;
  overallScore: number;
  sectionScores: SectionScore[];
  detailedFeedback: DetailedFeedback[];
  benchmarkResults: Record<string, BenchmarkResult>;
  processingTime: number;
  improvementPotential: number;
  sectionsFound: string[];
  usedPreferences: UsedPreferences;
  contentInfo: ContentInfo;
}

export interface LinkedInScanResponse {
  success: boolean;
  message: string;
  data: LinkedInScanResult;
}
