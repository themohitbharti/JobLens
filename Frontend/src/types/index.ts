export interface DailyScan {
  date: string;
  totalCount: number;
  resumeCount: number;
  linkedinCount: number;
  _id: string;
}

export interface ResumeStats {
  totalScans: number;
  weeklyScans: number;
  weeklyAvg: number;
  bestScore: number;
  lastScanDate?: string;
  improvementTrend: number;
}

export interface LinkedinStats {
  totalScans: number;
  weeklyScans: number;
  weeklyAvg: number;
  bestScore: number;
  lastScanDate?: string;
  improvementTrend: number;
}

// Updated interfaces for scan history
export interface LastResume {
  scanId: string;
  overallScore: number;
  scanDate: string;
}

export interface LastLinkedin {
  scanId: string;
  overallScore: number;
  scanDate: string;
}

export interface User {
  _id: string;
  email: string;
  fullName: string;
  googleId?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  dailyScans: DailyScan[];
  resumeStats: ResumeStats;
  linkedinStats?: LinkedinStats;
  // Updated to arrays for last 5 scans
  lastResumes: LastResume[];
  lastLinkedins: LastLinkedin[];
  scansLeft: number;
}

export interface ResumeStatsData {
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
  // Updated to match API response - now array
  lastResumes: LastResume[];
  scansLeft: number;
}

// New interface for LinkedIn stats data
export interface LinkedinStatsData {
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
  lastLinkedins: LastLinkedin[];
  scansLeft: number;
}
export interface ResumeScoreHistory {
  scanId: string;
  overallScore: number;
  scanDate: string;
}

export interface LastResumeScoresData {
  totalScans: number;
  scores: ResumeScoreHistory[];
}

export interface CombinedStatsData {
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
    lastResumes: LastResume[];
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
    lastLinkedins: LastLinkedin[];
  };
  scansLeft: number;
}
