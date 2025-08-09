export interface DailyScan {
  date: string;
  count: number;
  _id: string;
  totalCount?: number;
  resumeCount?: number;
  linkedinCount?: number;
}

export interface ResumeStats {
  bestScore: number;
  improvementTrend: number;
  totalScans: number;
  weeklyAvg: number;
  weeklyScans: number;
  lastScanDate: string;
}

export interface LinkedinStats {
  bestScore: number;
  improvementTrend: number;
  totalScans: number;
  weeklyAvg: number;
  weeklyScans: number;
  lastScanDate: string;
}

export interface User {
  _id: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
  dailyScans: DailyScan[];
  resumeStats: ResumeStats;
  linkedinStats?: LinkedinStats;
}

export interface ResumeStatsData {
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
}
