export interface DailyScan {
  date: string;
  count: number;
  _id: string;
}

export interface ResumeStats {
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
  __v: number;
  dailyScans: DailyScan[];
  resumeStats: ResumeStats;
}
