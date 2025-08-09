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

// New interface for lastResume
export interface LastResume {
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
  // New fields - allow null for consistency with API
  lastResume?: LastResume | null;
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
  // Updated to match API response - allow null
  lastResume: LastResume | null;
  scansLeft: number;
}
