import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "../config/envConfig";

export interface UserDocument extends mongoose.Document {
  email: string;
  fullName: string;
  googleId?: string;
  coverImage?: string;
  password: string;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  dailyScans: {
    date: Date;
    totalCount: number; // Total scans (resume + LinkedIn)
    resumeCount: number; // Resume scans only
    linkedinCount: number; // LinkedIn scans only
  }[];

  resumeStats: {
    totalScans: number; // Resume scans only
    weeklyScans: number; // Resume weekly scans
    weeklyAvg: number; // Average score for resume scans
    bestScore: number; // Best resume score
    lastScanDate?: Date; // Last resume scan date
    improvementTrend: number; // Trend based on resume scans only
  };

  linkedinStats: {
    totalScans: number; // LinkedIn scans only
    weeklyScans: number; // LinkedIn weekly scans
    weeklyAvg: number; // Average score for LinkedIn scans
    bestScore: number; // Best LinkedIn score
    lastScanDate?: Date; // Last LinkedIn scan date
    improvementTrend: number; // Trend based on LinkedIn scans only
  };

  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
  canPerformScan(): Promise<boolean>;
  updateDailyScanCount(scanType: 'resume' | 'linkedin'): Promise<void>;
  calculateResumeStats(): Promise<void>;
  calculateLinkedinStats(): Promise<void>;
  calculateImprovementTrend(scanType: 'resume' | 'linkedin'): Promise<void>;
  calculateTrendSlope(scores: number[]): number;
  initializeLinkedinStats(): void;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    coverImage: {
      type: String,
    },
    password: {
      type: String,
      required: function (): boolean {
        return !this.googleId; // Required only if not signed up via Google
      },
    },
    refreshToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },

    dailyScans: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        totalCount: {
          type: Number,
          default: 0,
        },
        resumeCount: {
          type: Number,
          default: 0,
        },
        linkedinCount: {
          type: Number,
          default: 0,
        },
      },
    ],

    resumeStats: {
      totalScans: {
        type: Number,
        default: 0,
      },
      weeklyScans: {
        type: Number,
        default: 0,
      },
      weeklyAvg: {
        type: Number,
        default: 0,
      },
      bestScore: {
        type: Number,
        default: 0,
      },
      lastScanDate: Date,
      improvementTrend: {
        type: Number,
        default: 0,
      },
    },

    linkedinStats: {
      totalScans: {
        type: Number,
        default: 0,
      },
      weeklyScans: {
        type: Number,
        default: 0,
      },
      weeklyAvg: {
        type: Number,
        default: 0,
      },
      bestScore: {
        type: Number,
        default: 0,
      },
      lastScanDate: {
        type: Date,
        default: null,
      },
      improvementTrend: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

userSchema.pre<UserDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  if (!this.password) {
    throw new Error("Password is undefined");
  }
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    config.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    config.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "10d",
    }
  );
};

userSchema.methods.canPerformScan = async function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayScans = this.dailyScans.find((scan: any) => {
    const scanDate = new Date(scan.date);
    scanDate.setHours(0, 0, 0, 0);
    return scanDate.getTime() === today.getTime();
  });

  return !todayScans || todayScans.totalCount < 30;
};

userSchema.methods.updateDailyScanCount = async function (scanType: 'resume' | 'linkedin') {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayIndex = this.dailyScans.findIndex((scan: any) => {
    const scanDate = new Date(scan.date);
    scanDate.setHours(0, 0, 0, 0);
    return scanDate.getTime() === today.getTime();
  });

  if (todayIndex >= 0) {
    this.dailyScans[todayIndex].totalCount += 1;
    if (scanType === 'resume') {
      this.dailyScans[todayIndex].resumeCount += 1;
    } else {
      this.dailyScans[todayIndex].linkedinCount += 1;
    }
  } else {
    const newScan = { 
      date: today, 
      totalCount: 1, 
      resumeCount: scanType === 'resume' ? 1 : 0, 
      linkedinCount: scanType === 'linkedin' ? 1 : 0 
    };
    this.dailyScans.push(newScan);
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  this.dailyScans = this.dailyScans.filter(
    (scan: any) => scan.date >= thirtyDaysAgo
  );
};

userSchema.methods.calculateResumeStats = async function () {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const ResumeScan = mongoose.model("ResumeScan");

  // Get resume scans from the last 7 days
  const weeklyResumeScans = await ResumeScan.find({
    userId: this._id,
    scanDate: { $gte: sevenDaysAgo },
  });

  this.resumeStats.weeklyScans = weeklyResumeScans.length;

  if (weeklyResumeScans.length > 0) {
    const totalScore = weeklyResumeScans.reduce(
      (sum: number, scan: any) => sum + scan.overallScore,
      0
    );
    this.resumeStats.weeklyAvg = Math.round(totalScore / weeklyResumeScans.length);
  } else {
    this.resumeStats.weeklyAvg = 0;
  }
};

userSchema.methods.initializeLinkedinStats = function() {
  if (!this.linkedinStats) {
    this.linkedinStats = {
      totalScans: 0,
      weeklyScans: 0,
      weeklyAvg: 0,
      bestScore: 0,
      lastScanDate: null,
      improvementTrend: 0,
    };
  }
};

userSchema.methods.calculateLinkedinStats = async function () {
  // Ensure LinkedIn stats are initialized
  this.initializeLinkedinStats();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const LinkedinScan = mongoose.model("LinkedinScan");

  // Get LinkedIn scans from the last 7 days
  const weeklyLinkedinScans = await LinkedinScan.find({
    userId: this._id,
    scanDate: { $gte: sevenDaysAgo },
  });

  this.linkedinStats.weeklyScans = weeklyLinkedinScans.length;

  if (weeklyLinkedinScans.length > 0) {
    const totalScore = weeklyLinkedinScans.reduce(
      (sum: number, scan: any) => sum + scan.overallScore,
      0
    );
    this.linkedinStats.weeklyAvg = Math.round(totalScore / weeklyLinkedinScans.length);
  } else {
    this.linkedinStats.weeklyAvg = 0;
  }
};

userSchema.methods.calculateImprovementTrend = async function (scanType: 'resume' | 'linkedin') {
  // Ensure stats are initialized
  if (scanType === 'linkedin') {
    this.initializeLinkedinStats();
  }

  const ScanModel = mongoose.model(scanType === 'resume' ? "ResumeScan" : "LinkedinScan");

  // Get last 10 scans of specific type to calculate trend
  const recentScans = await ScanModel.find({
    userId: this._id,
  })
    .sort({ scanDate: -1 })
    .limit(10)
    .select("overallScore scanDate");

  if (recentScans.length < 2) {
    if (scanType === 'resume') {
      this.resumeStats.improvementTrend = 0;
    } else {
      this.linkedinStats.improvementTrend = 0;
    }
    return;
  }

  // Calculate trend using linear regression
  const scores = recentScans.reverse().map((scan: any) => scan.overallScore);
  const trend = this.calculateTrendSlope(scores);

  const roundedTrend = Math.round(trend * 100) / 100; // Round to 2 decimal places
  
  if (scanType === 'resume') {
    this.resumeStats.improvementTrend = roundedTrend;
  } else {
    this.linkedinStats.improvementTrend = roundedTrend;
  }
};

userSchema.methods.calculateTrendSlope = function (scores: number[]) {
  const n = scores.length;
  if (n < 2) return 0;

  // Simple linear regression slope calculation
  const xValues = Array.from({ length: n }, (_, i) => i + 1);
  const xMean = xValues.reduce((a, b) => a + b, 0) / n;
  const yMean = scores.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (xValues[i] - xMean) * (scores[i] - yMean);
    denominator += (xValues[i] - xMean) ** 2;
  }

  return denominator === 0 ? 0 : numerator / denominator;
};

export const User = mongoose.model<UserDocument>("User", userSchema);
